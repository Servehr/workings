import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import UserService from "@/service/user.service";
import mongoose from "mongoose";

class UserController implements IController {

    public path = '/user';
    public router = Router();
    private userService = new UserService();

    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.users)

        this.router.post(`${this.path}/create`,
            this.create
        )
        this.router.put(`${this.path}/update`,
            // validateMiddleware(validate.register),
            this.update
        )
        this.router.put(`${this.path}/remove`,
            // validateMiddleware(validate.register),
            this.remove
        )
        this.router.put(`${this.path}/restore`,
            // validateMiddleware(validate.register),
            this.restore
        )
        this.router.put(`${this.path}/delete`,
            // validateMiddleware(validate.register),
            this.delete
        )
        this.router.post(`${this.path}/authorize`,
            // validateMiddleware(validate.register),
            this.authorize
        )
        this.router.post(`${this.path}/:type/users`,
            // validateMiddleware(validate.register),
            this.userLists
        )
        this.router.post(`${this.path}/:user/profile`,
            // validateMiddleware(validate.register),
            this.profile
        )
        this.router.post(`${this.path}/subscribe`,
            // validateMiddleware(validate.register),
            this.subscribe
        )
        this.router.get(`${this.path}/subscribers`,
            // validateMiddleware(validate.register),
            this.subscribers
        )   
        this.router.get(`${this.path}/:user`,
            // validateMiddleware(validate.register),
            this.searchUser
        )  
        this.router.post(`${this.path}/fast-response`,
            // validateMiddleware(validate.register),
            this.fastResponse
        )
    }

    private users = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        const categories = await this.userService.users();
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: 'All Users',
          data: categories,
          statusCode: 200
        }
        res.status(200).json(data)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { user } = req?.body
            if(user)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt to all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                const NewlyCreated = await this.userService.create(user)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${NewlyCreated} created`,
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

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { user } = req?.body
            if(!mongoose.isValidObjectId(user?.user)) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            }

            if(!user)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt to all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                await this.userService.update(user)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'user updated',
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

    private remove = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { user } = req?.body
            if(!mongoose.isValidObjectId(user)) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.userService.remove(user)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${deetedAt} deleted`,
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

    private restore = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { user } = req?.body
            if(!mongoose.isValidObjectId(user)) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.userService.restore(user)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${deetedAt} restored`,
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

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { user } = req?.body
            if(!mongoose.isValidObjectId(user))
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.userService.delete(user)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${deetedAt} permanently deleted`,
                    data: { },
                    statusCode: 200
                }
                res.status(200).json(data)
            }
        } catch (error: any) {
        }
    }

    private authorize = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {

            const { user, department, role } = req?.body
            if(!mongoose.isValidObjectId(department) && !!mongoose.isValidObjectId(role)) 
            {    
            const data: { message: string, data: object, statusCode: number } = 
            {
                message: 'Invalid parameter passed',
                data: { },
                statusCode: 404
            }
            res.status(404).json(data)
            } else {
            const authoring = await this.userService.authorize(user, department, role)
            const data: { message: string, data: object, statusCode: number } = 
            {
                message: authoring!,
                data: {  },
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

    private userLists = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
           const type = req?.params?.type
           const deetedAt = await this.userService.userLists(type)
           const data: { message: string, data: object, statusCode: number } = 
           {
              message: `All user`,
              data: { },
              statusCode: 200
           }
           res.status(200).json(data)
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

    private profile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
           const type = req?.params?.type
           const user = await this.userService.profile(type)
           const data: { message: string, data: object, statusCode: number } = 
           {
              message: `${user?.firstname} ${user?.surname} info`,
              data: { },
              statusCode: 200
           }
           res.status(200).json(data)
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

    private searchUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try
        {
          const user = req.params.user
          const searchResult = await this.userService.searchUser(user)
          let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
             message: 'Search result',
             statusCode: 200,
             data: searchResult 
           }
           res.status(200).json(RESPONSE)
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

    private subscribe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try
        {
          const { email } = req.body
          const subscription = await this.userService.newsLetter(email)
          let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
             message: 'Subscription successful',
             statusCode: 200,
             data: subscription 
           }
           res.status(200).json(RESPONSE)
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

    private subscribers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try
        {
          const subscribers = await this.userService.subscribers()
          let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
             message: 'subscribers',
             statusCode: 200,
             data: subscribers 
           }
           res.status(200).json(RESPONSE)
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
    private fastResponse = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try
        {
          const { firstname, surname, phone, email, message } = req?.body
          
          const formResponse = await this.userService.fastResponse(firstname, surname, phone, email, message)
          let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
             message: 'Form Sent',
             statusCode: 200,
             data: formResponse 
           }
           res.status(200).json(RESPONSE)
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

export default UserController;