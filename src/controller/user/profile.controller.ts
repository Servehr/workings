import { Router, Request, Response, NextFunction } from "express";
import IController from "@/interfaceIController";
import UserService from "@/service/user.service";
import authenticateMiddleware from "@/middleware/validation/authenticated.middleware";


class ProfileController implements IController {

    public path = '/'

    public router = Router();
    private userService = new UserService();

    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        
        // this.router.get(`${this.path}profile`, IsAuthenticated, this.profile)
        this.router.get(`${this.path}profile/:id`, authenticateMiddleware, this.profile)

        // this.router.get(`${this.path}search/:user`, authenticateMiddleware, this.search)
    }
    
    private profile = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
                
        const user = req.params.id
        const allUsers = await this.userService.profile(user)
        let RESPONSE: { message: string, statusCode: number, data: any } = 
         {
           message: 'User data',
           statusCode: 200,
           data: allUsers 
         }
        res.status(200).json(RESPONSE)
    }
    
    // private search = async(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ): Promise<Response | void> => {
                
    //     try
    //     {
    //       const user = req.params.user
    //       const searchResult = await this.userService.searchUser(user)
    //       let RESPONSE: { message: string, statusCode: number, data: any } = 
    //        {
    //          message: 'Search result',
    //          statusCode: 200,
    //          data: searchResult 
    //        }
    //        res.status(200).json(RESPONSE)
    //     } catch (error: any) {
    //         const err = JSON.parse(error.message)
    //         const errMsg = err.message 
    //         const code = err.statusCode
            
    //         const data: any = 
    //         {
    //            message: errMsg,
    //            data: { },
    //            statusCode: code
    //         }
    //         res.status(code).json(data)
    //     }
    // }

}

export default ProfileController;