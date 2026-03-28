import { Router, Request, Response, NextFunction } from "express";
import IController from "@/interfaceIController";
import HttpException from "@/exception/http.exception";
import validateMiddleware from "@/middleware/validate.middleware";
import validate from "@/middleware/validation/user.type.request.validation";
import UserTypeService from "@/service/user.type.service";
import send from '@/helper/response';


class UserTypeController implements IController {

    public path = '/user-type';
    public router = Router();
    private userTypeService = new UserTypeService();

    constructor()
    {
        this.initializeRoutes();
    }

    private initializeRoutes() : void 
    {
        this.router.post(
            `${this.path}`,
            // validateMiddleware(validate.create),
            this.create
        );
    }

    private create = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
           const { name, abbr, slug, description } = req.body;
           const userType = await this.userTypeService.create(name, abbr, slug, description);
           res.status(200).json({ userType });
        //    send.send(res, 200, '', userType);
        } catch (error) {
            next(new HttpException(400, 'Error performing user-type operation'));
        }
    }

}

export default UserTypeController;