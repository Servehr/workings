import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import JobService from "@/service/job.service";
import mongoose from "mongoose";
import { errorProps, responseFormat } from "@/utils/response-format";


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
        const jobs = await this.jobService.jobs();
        return res.sendSuccess(jobs, `All jobs`)
    }

    private jobStatus = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        const status = req.params.status
        const jobs = await this.jobService.jobStatus(status);
        return res.sendSuccess(jobs, `All ${status} job`)
    }

    private cancelJob = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        const { status, job } = req.body
        const CancelledJob = await this.jobService.cancelJob(status, job);
        return res.sendSuccess({}, CancelledJob)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { job } = req?.body;
            if(!mongoose.isValidObjectId(job?.category)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            if(!job)
            {                
               responseFormat('Attempt to all field', 400, null)
            } else {
                const NewlyCreated = await this.jobService.create(job)
                return res.sendSuccess({}, `${NewlyCreated}`)
            }
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }

    private removeJob = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { job } = req.body
       await this.jobService.removeJob(job);
       return res.sendSuccess({}, `Job deleted`)
    }

    private restoreJob = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { job } = req.body
       await this.jobService.restoreJob(job);
       return res.sendSuccess({}, `Job restored`)
    }

    private deleteJob = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { job } = req.body
       await this.jobService.deleteJob(job);
       return res.sendSuccess({}, `Job permanently deleted`)
    }


       


}

export default JobController;