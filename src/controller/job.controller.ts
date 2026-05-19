import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import JobService from "@/service/job.service";
import mongoose from "mongoose";


class JobController implements IController {

    public path = '/job';
    public router = Router();
    private jobService = new JobService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.jobs)

        this.router.post(`${this.path}/create`,
            // validateMiddleware(validate.register),
            this.create
        )
        this.router.put(`${this.path}/cancel`,
            // validateMiddleware(validate.register),
            this.cancelJob
        )
        this.router.get(`${this.path}/status/:status`,
            // validateMiddleware(validate.register),
            this.jobStatus
        )
        this.router.put(`${this.path}/remove`,
            // validateMiddleware(validate.register),
            this.removeJob
        )
        this.router.put(`${this.path}/restore`,
            // validateMiddleware(validate.register),
            this.restoreJob
        )
        this.router.put(`${this.path}/delete`,
            // validateMiddleware(validate.register),
            this.deleteJob
        )
    }

    private jobs = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        const plans = await this.jobService.jobs();
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: 'All jobs',
          data: plans,
          statusCode: 200
        }
        res.status(200).json(data)
    }

    private jobStatus = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        const status = req.params.status
        const plans = await this.jobService.jobStatus(status);
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: `All ${status} job`,
          data: plans,
          statusCode: 200
        }
        res.status(200).json(data)
    }

    private cancelJob = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        const { status, job } = req.body
        const CancelledJob = await this.jobService.cancelJob(status, job);
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: CancelledJob,
          data: { },
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
            const { job } = req?.body;
            // res.status(200).json(job)
            if(!mongoose.isValidObjectId(job?.category)) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                 message: 'Invalid parameter passed',
                 data: { },
                 statusCode: 404
               }
               res.status(404).json(data)
            }
            if(!job)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt to all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                const NewlyCreated = await this.jobService.create(job)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${NewlyCreated}`,
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

    private removeJob = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { job } = req.body
       await this.jobService.removeJob(job);
       const data: { message: string, data: object, statusCode: number } = 
       {
         message: `Job deleted`,
         data: { },
         statusCode: 200
       }
       res.status(200).json(data)
    }

    private restoreJob = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { job } = req.body
       await this.jobService.restoreJob(job);
       const data: { message: string, data: object, statusCode: number } = 
       {
         message: `Job restored`,
         data: { },
         statusCode: 200
       }
       res.status(200).json(data)
    }

    private deleteJob = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { job } = req.body
       await this.jobService.deleteJob(job);
       const data: { message: string, data: object, statusCode: number } = 
       {
         message: `Job permanently deleted`,
         data: { },
         statusCode: 200
       }
       res.status(200).json(data)
    }


       


}

export default JobController;