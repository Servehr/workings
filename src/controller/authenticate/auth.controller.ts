import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import HttpException from "@/exception/http.exception"
import AuthService from "@/service/auth.service"
import { IsAuthenticated } from "@/middleware/isAuthenticated"
import { createToken } from "@/helper/token"


class AuthController implements IController {

    public path = '/auth';
    public router = Router();
    private authService = new AuthService();

    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.post(`${this.path}/testing`,
            // validateMiddleware(validate.testing),
            this.testing
        )
        this.router.post(`${this.path}/register`,
            // validateMiddleware(validate.register),
            this.register
        )
        this.router.post(`${this.path}/login`,
            // validateMiddleware(validate.login),
            this.login
        )
        this.router.get(`${this.path}/activate-account/:hash`,
            // validateMiddleware(validate.login),
            this.activate
        )
        this.router.post(`${this.path}/forgot`,
            // validateMiddleware(validate.login),
            this.forgot
        )
        this.router.get(`${this.path}/verify-account/:hash`,
            // validateMiddleware(validate.login),
            this.verifyAccount
        )
        this.router.post(`${this.path}/reset-password`,
            // validateMiddleware(validate.login),
            this.resetPassword
        )
        this.router.post(`${this.path}/logout`,
            IsAuthenticated,
            // validateMiddleware(validate.login),
            this.logout
        )
        this.router.post(`${this.path}/is-user-in-session`, IsAuthenticated, this.isInSession
        )
    }

    private testing = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        
        res.status(200).json("I got tested")
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { firstname, surname, phone, email, password, cPassword, category } = req?.body
            if(password !== cPassword)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Invalid username or password',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                let userType: string = category?.toLowerCase()
                await this.authService.register(
                    firstname, surname, phone, email, password, userType
                )
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Registration successful, activation mail has been sent to you',
                    data: { },
                    statusCode: 200
                }
                res.status(200).json(data)
            }
        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: { message: string, data: object, statusCode: number } = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)
        }
    }

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        try {
            const { email, password } = req.body
            const newUser = await this.authService.login(email, password)

            let token = createToken(newUser)
            const data: { message: string, data: object, statusCode: number } = 
            {
               message: 'Authentication successful',
               data: {
                  user: { 
                    id: newUser?._id,
                    firstname: newUser?.firstname,
                    surname: newUser?.surname
                  },
                  token: token
               },
               statusCode: 200
            }
            res.status(200).json(data)

        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: any = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)
        }
    }

    private activate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        try 
        {
            const hash = req.params.hash
            await this.authService.activateUserAccount(hash)
            const { FRONTEND_URL } = process.env
            res.redirect(FRONTEND_URL+'auth/login')
            // const data: { message: string, data: object, statusCode: number } = 
            // {
            //    message: 'Activation successful',
            //    data: { },
            //    statusCode: 200
            // }
            // res.status(200).json(data)

        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: any = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)
        }
    }

    private logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        try 
        {
           req.session.destroy(err => 
           {
              if(err) 
              {
                return res.status(500).send('Could not log out')
              }
              res.clearCookie('connect.sid'); // Clear the session ID cookie from the client
              res.send('Logged out successfully');
           })
        } catch (error: any) {
            next(new HttpException(400, "Operation failed"));
        }
    }

    private isInSession = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        let fullname: string = req.session.user?.firstname + ' ' + req.session.user?.surname
        res.status(200).json(fullname)
    }

    private forgot = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        try 
        {
            const { email } = req.body
            await this.authService.forgot(email)
            const data: { message: string, data: object, statusCode: number } = 
            {
               message: 'Reset link sent to email.',
               data: { },
               statusCode: 200
            }
            res.status(200).json(data)

        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: any = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)
        }
    }

    private verifyAccount = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        const { FRONTEND_URL } = process.env
        try 
        {
            const hash = req.params.hash
            const resetUserPassword = await this.authService.verifyUser(hash)
            res.redirect(FRONTEND_URL+'auth/new-password?new='+resetUserPassword)

        } catch (error: any) {
            res.redirect(FRONTEND_URL+'auth/login')
        }
    }

    private resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        
        try 
        {
          const { password, cPassword, user } = req?.body
          if(password !== cPassword)
          {                
             let RESPONSE: { message: string, statusCode: number, data: any } = {
                message: 'Password do not match',
                statusCode: 404,
                data: null
             }
             throw new Error(JSON.stringify(RESPONSE))
          }

          const passwordReset = await this.authService.resetPassword(password, user)
          const data: { message: string, data: object, statusCode: number } = 
          {
            message: passwordReset,
            data: { },
            statusCode: 200
          }
          res.status(200).json(data)
        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: any = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)            
        }


    }



}

export default AuthController;