import { Router, Request, Response, NextFunction } from "express";
import IController from "@/interfaceIController";
import HttpException from "@/exception/http.exception";
import UserService from "@/service/user.service";
import { IsAuthenticated } from "@/middleware/isAuthenticated";
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

}

export default ProfileController;