import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import UserService from "@/service/user.service";
import mongoose from "mongoose";
import { errorProps, responseFormat } from "@/utils/response-format";

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

        const users = await this.userService.users();
        return res.sendSuccess(users, `All User`)
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
                responseFormat('Attempt to all field', 400, null)
            } else {
                const NewlyCreated = await this.userService.create(user)
                return res.sendSuccess({}, `${NewlyCreated} created`)
            }
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
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
               responseFormat('Invalid parameter passed', 400, null)
            }

            if(!user)
            {        
                responseFormat('Attempt to all field', 400, null)
            } else {
                await this.userService.update(user)
                return res.sendSuccess({}, `user updated`)
            }
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
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
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.userService.remove(user)
                return res.sendSuccess({}, `${deetedAt} deleted`)
            }
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
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
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.userService.restore(user)
                return res.sendSuccess({}, `${deetedAt} restored`)
            }
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
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
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.userService.delete(user)
                return res.sendSuccess({}, `${deetedAt} permanently deleted`)
            }
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)            
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
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const authoring = await this.userService.authorize(user, department, role)
                return res.sendSuccess({}, authoring!)
            }
            
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)  
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
           await this.userService.userLists(type)
           return res.sendSuccess({}, 'All user')
           
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
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
           return res.sendSuccess({}, `${user?.firstname} ${user?.surname} info`)

        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
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
          return res.sendSuccess(searchResult, `Searched result`)

        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
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
          return res.sendSuccess(subscription, `Subscription successful`)

        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
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
          return res.sendSuccess(subscribers, `subscribers`)

        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
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
          return res.sendSuccess(formResponse, `Form Sent`)
          
        } catch (error: any) {
            
           let err = JSON.parse(error.message)
           const { errMsg, code, data } = errorProps(err)
           res.sendError(errMsg, code, data)
        }
    }    


}

export default UserController;