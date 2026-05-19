import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import NotificationService from "@/service/settings/notification";
import mongoose from "mongoose";


class NotificationController implements IController {

    public path = '/notify';
    public router = Router();
    private notificationService = new NotificationService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.sms)

        this.router.post(`${this.path}/create`,
            // validateMiddleware(validate.register),
            this.sms
        )
    }

    
    
    private sms = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { phoneNumber, message } = req.body
       const notify = await this.notificationService.SendSms(phoneNumber, message);
       const data: { message: string, data: object, statusCode: number } = 
       {
         message: notify,
         data: { },
         statusCode: 200
       }
       res.status(200).json(data)
    }

}

export default NotificationController;