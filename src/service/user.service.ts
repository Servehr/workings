
import Department from "@/model/department";
import User from "@/model/user";
import UserType from "@/model/userType.model"
import Newsletter from "@/model/newsletter";
import { paginate } from "@/utils/pagination";
import fastForm from "@/model/management/fast-response"
import { responseFormat } from "@/utils/response-format";




class UserService {

    
    public async users(): Promise<Error | String | any>
    {
       return await User.find(
          { deletedAt: null },
          { firstname: 1, surname: 1, phone: 1, email: 1, status: 1, profilePicture: 1, role: 1, skills: 1, country: 1, state: 1, lga: 1, company: 1,  }
       ) 

      //  return await User.find(
      //     {  
      //       $or: [
      //         { "newField": true },
      //         { "newField": { "$exists": false } }
      //       ], 
      //       deletedAt: null   
      //     },
      //     { name: 1, description: 1 }
      //  ) 
    
    }


    public async create(user: any): Promise<Error | string | any>
    {
      await User.create({ user })
      const fullname: string = `${user?.firstname} - ${user?.lastname}`
      return fullname
    }


    public async update(user: any): Promise<Error | string | any>
    {
       const UserToUpdate = await User.findOne({ _id: user?.user })
       if(!UserToUpdate)
       {
          responseFormat('Invalid request passed', 400, null)       
        }
        await User.updateOne({ _id: user?.user }, { $set: { firstname: user.firstname, lastname: user?.lastname } })
        const fullname: string = `${user?.firstname} - ${user?.lastname}` 
        return fullname
    }


    public async remove(user: string): Promise<Error | string | any>
    {
       const RemoveUser = await User.findOne({ _id: user })
       if(!RemoveUser)
       {
          responseFormat('Invalid request passed', 400, null)
       }
       await User.updateOne({ _id: user }, { $set: { deletedAt: new Date() } })
       const fullname: string = `${RemoveUser?.firstname} - ${RemoveUser?.surname}` 
       return fullname
    }


    public async restore(user: string): Promise<Error | string | any>
    {
      const RestoreUser = await User.findOne({ _id: user })
      if(!RestoreUser)
      {
        responseFormat('Invalid request passed', 400, null)
      }
      await User.updateOne({ _id: user }, { $set: { deletedAt: null } })
      const fullname: string = `${RestoreUser?.firstname} - ${RestoreUser?.surname}` 
      return fullname
    }


    public async delete(user: string): Promise<Error | string | any>
    {
      const DeleteUser = await User.findOne({ _id: user })
      if(!DeleteUser)
      {
        responseFormat('Invalid request passed', 400, null)
      }
      await User.deleteOne({ _id: user })
      const fullname: string = `${DeleteUser?.firstname} - ${DeleteUser?.surname}` 
      return fullname
    }

    public async authorize(user: string, department: string, role: string)
    {
      const DoesUserExist = await User.findOne({ _id: user })
      if(!DoesUserExist)
      {
        responseFormat('Invalid user parameter passed', 400, null)
      } 
       
      const DoesDepartmentExist = await Department.findOne({ _id: department })
      if(!DoesDepartmentExist)
      {
        responseFormat('Invalid department parameter passed', 400, null)
      } 
       
      const DoesRoleExist = await Department.findOne({ _id: role })
      if(!DoesRoleExist)
      {
        responseFormat('Invalid role parameter passed', 400, null)
      } 

      let UserRole =  DoesUserExist?.role

      let message: string = ''
      if(UserRole)
      {
        await User.findByIdAndUpdate(user, 
          { $pull: { role: role } }, 
          { new: true }
        )
        message = `${DoesUserExist?.firstname} ${DoesUserExist?.surname} assigned from ${DoesRoleExist?.name}`
      } else {
        await User.findByIdAndUpdate(user, 
          { $push: { role: role } }, 
          { new: true }
        )
        message = `${DoesUserExist?.firstname} ${DoesUserExist?.surname} withdrawn from ${DoesRoleExist?.name}`
      } 
      return message      
    }    


    public async userLists(userType: string)
    {
       const DoesUserTypeExist = await UserType.findOne({ _id: userType })
       if(!DoesUserTypeExist)
       {
         responseFormat('Invalid user parameter passed', 400, null)
       } 

       return await User.find(
         {  
           $or: [
             { "newField": true },
             { "newField": { "$exists": false } }
           ], 
           deletedAt: null   
         },
         { firstname: 1, surname: 1, phone: 1, email: 1, profilePicture: 1, department: 1, role: 1 }
       ).populate({
           path: 'department',
           match: { deletedAt: null },
           select: '_id name description'
       })      
    }

    public async profile(user: string): Promise<any>
    {
       const DoesUserExist = await User.findOne({ _id: user })
       if(!DoesUserExist)
       {
         responseFormat('Invalid user parameter passed', 400, null)
       } 
      if(!DoesUserExist)
      {
         return []
      }
      return await User.find({ _id: user }).select('-_id firstname surname phone email userType')
    }

    public async searchUser(keyword: string)
    {
       const users = await User.find(
        {
          $or: [
            { firstname: { $regex: keyword, $options: 'i' } },
            { surname: { $regex: keyword, $options: 'i' } },
          ]
        }, { firstname: 1, surname: 1, profilePicture: 1 }
       )
       return users
    }

    public async AssignActionsToRole(role: string, rexource: string, actions: string[])
    {
       
    }

    public async newsLetter(email: string)
    {
        const haSubscribed = await User.findOne({ email: email })
        if(haSubscribed)
        {
          responseFormat('User already subscribed', 400, null)
        }
        const hasAnonymouseSubscribed = await Newsletter.findOne({ email: email })
        if(hasAnonymouseSubscribed)
        {
          responseFormat(`anonymous with email ${email} already subscribed`, 400, null)
        }
        await Newsletter.create({ email })
        return
        // const subscriber = new User()
        // subscriber.set('newsletter.registered', false)
        // subscriber.set('newsletter.email', email)
    }

    public async subscribers()
    {
      //  return await Newsletter.find(
      //     { deletedAt: null },
      //     { email: 1 }
      //  )  
       const susbcriptions = await paginate(Newsletter, { deletedAt: null }, { page: 1, limit: 5, sort: { _id: 1 } }, 'email -_id', '')    
       return susbcriptions
    }

    public async fastResponse(firstname: string, surname: string, phone: string, email: string, message: string)
    {
       await fastForm.create({firstname, surname, phone, email, message})
       return       
    }


    // Inside your controller
    // const getUsers = async (req, res) => {
    //   const { page, limit } = req.query;
      
    //   // Use the reusable function
    //   const result = await paginate(UserModel, { active: true }, { 
    //     page: parseInt(page), 
    //     limit: parseInt(limit),
    //     sort: { createdAt: -1 } 
    //   });
      
    //   res.json(result);
    // };

    

}

export default UserService;