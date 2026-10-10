import Token from "@/helper/token";
import IUser from "@/interfaceIUser";
import User, { saltRounds } from "@/model/user";
import bcrypt from 'bcrypt';
import { sendEmailToUser } from "@/helper/sendemail";
import ActivateAccount from "@/model/activate-account";
import { random } from "@/helper/random";
import { differenceInDays, format, formatDistance, isAfter } from 'date-fns'
import ResetPassword from "@/model/reset-password";
import ResetPasswordHistory from "@/model/reset-password-history";
import { sendEmailToUserForgot } from "@/helper/send-email-forgot";
import { responseFormat } from "@/utils/response-format";
import { uploadImages } from "@/utils/uploadImages";




class AuthService {

    
    public async register(                              
        firstname: string,
        surname: string,
        phone: string,
        email: string,
        password: string,
        userType: string,
        ninImage: string,
        passportImage: string
    ): Promise<IUser | Error | String>
    {
      let imgs: string[] = []
      const registrationImages: { image: string, folder: string }[] = [{ image: ninImage, folder: 'nin' }, { image: passportImage, folder: 'passport' }]
      
      await uploadImages(registrationImages)
      .then((results) => 
      {
         const secureUrls: any = results.map(result => result.secure_url)
         imgs.push(secureUrls)
      })

      if(imgs.length === 0)
      {
         responseFormat('Uplading image to server failed', 400, null)
      }

      const user = await User.findOne({ email });
      if(user)
      { 
        responseFormat('User with email already exist', 400, null)
      }
      const { BACKEND_URL } = process.env;
       
      const randomValues: string = random.character(60)
      const activation_url: string = BACKEND_URL+'auth/activate-account/'+randomValues

      const nin = imgs[0]
      const passport = imgs[1]

      const newUser = await User.create({ firstname, surname, phone, email, password, userType, nin, passport })
      const activate = await ActivateAccount.create({ userId: newUser?._id, hashString: randomValues })
      await User.updateOne({ _id: newUser?._id }, { $set: { activateAccount: activate?._id } })

      Object.assign(newUser, { url: activation_url})
       
      try 
      {
          const sendUserMail = await sendEmailToUser(newUser)
          if(sendUserMail === false)
          {
            let RESPONSE: { message: string, statusCode: number, data: any } = {
              message: 'Email server is currently down',
              statusCode: 404,
              data: null
            }
            throw new Error(JSON.stringify(RESPONSE))
          }
          
          let fullname: string = `${newUser?.firstname} ${newUser?.surname}`
          let msg: string = `${fullname} successfuly registered`
          return msg  

      } catch (error) {
          let RESPONSE: { message: string, statusCode: number, data: any } = 
          {
            message: 'Email server is currently down',
            statusCode: 404,
            data: null
          }

          await User.deleteOne({ _id: newUser?._id })
          throw new Error(JSON.stringify(RESPONSE))
      }
    }
    
    public async login(email: string, password: string): Promise<any>
    {
      const user = await User.findOne({ email })
      if(!user)
      {
         let RESPONSE: { message: string, statusCode: number, data: any } = {
           message: 'Invalid email or password',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
      }

      if(await user.isValidPassword(password))
      {
        let token = Token.createToken(user)
        Object.assign(user, { token: token})
        const { _id, firstname, surname, status } = user 
        
        const u: any = { _id, firstname, surname, token }

        const Status: string[] = ['pending', 'suspended', 'exited', 'scrutiney']
        if(Status?.includes(status))
        {
           let RESPONSE: { message: string, statusCode: number } = {
           message: 'Account is '+ status,
           statusCode: 404
         }
         throw new Error(JSON.stringify(RESPONSE))
        }
        return u
        
      } else {
         responseFormat('Invalid email or password', 400, null)
      }      
    }
    
    public async activateUserAccount(hash: string): Promise<any>
    {
      const AccountActivation = await ActivateAccount.findOne({ hashString: hash })
      if(!AccountActivation)
      {
         let RESPONSE: { message: string, statusCode: number, data: any } = {
           message: 'Invalid activation link',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))         
      }
      const activationDate: Date = new Date(AccountActivation?.entry)
      const todaysDate: Date = new Date(Date.now())

      const registeredDate = activationDate.toLocaleDateString('sv-SE', { year: "numeric", month: "2-digit", day: "2-digit" })
      const toDay = todaysDate.toLocaleDateString('sv-SE', { year: "numeric", month: "2-digit", day: "2-digit" })
      
      const howLong = differenceInDays(toDay, registeredDate)

      if(howLong > 0) 
      {
         await ActivateAccount.updateOne({ userId: AccountActivation?.userId }, { $set: { status: 'expired' } })
         let RESPONSE: { message: string, statusCode: number, data: any } = {
           message: 'Acivation link expired',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
      }
      await ActivateAccount.updateOne({ userId: AccountActivation?.userId }, { $set: { status: 'activated' } })      
      await User.updateOne({ _id: AccountActivation?.userId }, { $set: { status: 'active' } })      
      return      
    }

    public async forgot(email: string): Promise<any>
    {
      const user = await User.findOne({ email })
      if(!user)
      {
         responseFormat('Invalid username or password', 400, null)
      }
      if(user?.status != 'active')
      {
         responseFormat('Account pending activation', 400, null)
      }
      // send reset password link
      const { BACKEND_URL } = process.env;
       
      const randomValues: string = random.character(120)
      const str: string = randomValues
      const hashing = str.replace(/\s+/g, '')
      const activation_url: string = BACKEND_URL+'auth/verify-account/'+hashing

      if(user)
      {
        Object.assign(user, { url: activation_url})
      }     

      const userId: string = user?._id

      const resetPswd = await ResetPassword.create({ userId, hashString: hashing })
      if(!resetPswd)
      {
        await ResetPassword.deleteOne({ _id: resetPswd?._id })         
        responseFormat('Activation process failed', 400, null)      
      }
       
      try 
      {
          const sendUserMail = await sendEmailToUserForgot(user)
          if(sendUserMail === false)
          {            
            responseFormat('Email server is currently down', 400, null)
          }
          return  

      } catch (error) {
        
          await ResetPassword.deleteOne({ _id: resetPswd?._id })
          responseFormat('Email server is currently down', 400, null)
      }
    }

    public async verifyUser(hash: string): Promise<any>
    {
       const resetPass = await ResetPassword.findOne({ hashString: hash })
       if(!resetPass)
       {
         responseFormat('Setting new password failed', 400, null)
       }
       const userId: string = resetPass?.userId
       const hashString: string = resetPass?.hashString

       await ResetPasswordHistory.create({ userId, hashString })
       await ResetPassword.deleteOne({ userId: userId })

       const firstRandomValue: string = random.character(35)
       const secondRandomValue: string = random.character(39)
      
       const valueOne: string = firstRandomValue
       const hashStringOne = valueOne.replace(/\s+/g, '')

       const valueTwo: string = secondRandomValue
       const hashStringTwo = valueTwo.replace(/\s+/g, '')

       const hashing = hashStringOne+'+'+userId+'+'+hashStringTwo
       return hashing
    }

    public async resetPassword(password: string, user: string): Promise<any>
    {
      const Uzer = await User.findOne({ _id: user })
      if(!Uzer)
      {
        responseFormat('Error setting new password', 400, null)
      }

      const hash = await bcrypt.hash(password, saltRounds)
      await User.findOneAndUpdate({ _id: user }, { $set: { password: hash } })
      let fullname: string = `${Uzer?.firstname} ${Uzer?.surname}`
      let msg: string = `${fullname} successfuly changed password`
      return msg
    }

}

export default AuthService;