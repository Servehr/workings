import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import AboutService from "@/service/cms/about.service";
import mongoose from "mongoose";


class AboutController implements IController {

    public path = '/about';
    public router = Router();
    private aboutService = new AboutService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.aboutus)

        this.router.post(`${this.path}/create`,
            // validateMiddleware(validate.register),
            this.create
        )
        this.router.put(`${this.path}/update`,
            // validateMiddleware(validate.register),
            this.update
        )
    }

    private aboutus = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        const plans = await this.aboutService.aboutus();
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: 'All plans',
          data: plans,
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
            const { aboutus } = req?.body
            if(!aboutus)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                const NewlyCreated = await this.aboutService.create(aboutus)
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
            const { about, aboutus } = req?.body
            if(!mongoose.isValidObjectId(about)) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            }

            if(!aboutus)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt to all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                await this.aboutService.update(about, aboutus)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'about content updated',
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
       


}

export default AboutController;