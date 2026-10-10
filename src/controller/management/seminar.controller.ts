import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import mongoose from "mongoose";
import { errorResponse, responseFormat } from "@/utils/response-format";
import SeminarService from "@/service/seminar.service";


class SeminarController implements IController {

    public path = '/seminar';
    public router = Router();
    private seminarService = new SeminarService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.plans)

        this.router.post(`${this.path}/create`,
            // validateMiddleware(validate.register),
            this.create
        )
        this.router.put(`${this.path}/update`,
            // validateMiddleware(validate.register),
            this.update
        )
        this.router.put(`${this.path}/hgighlight-update`,
            // validateMiddleware(validate.register),
            this.highlightUpdate
        )
        this.router.put(`${this.path}/hgighlight-removed`,
            // validateMiddleware(validate.register),
            this.removeHighlight
        )
        this.router.put(`${this.path}/hgighlight-restored`,
            // validateMiddleware(validate.register),
            this.restoredHighlight
        )
        this.router.put(`${this.path}/delete-highlight`,
            // validateMiddleware(validate.register),
            this.deleteHighlight
        )
    }

    
    private plans = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const plans = await this.seminarService.seminars(Number(page), Number(limit));
        return res.sendSuccess(plans, `All plans`)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { plan, price, highlights } = req?.body
            if(!plan || !price || !highlights)
            {                
                responseFormat('Account pending activation', 400, null)
            } else {
                const NewlyCreated = await this.seminarService.create(plan.toLowerCase())
                return res.sendSuccess({}, `${NewlyCreated} created`)
            }
        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { plann, plan, price } = req?.body
            if(!mongoose.isValidObjectId(plann)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }

            if(!plan || !price)
            {                
                responseFormat('Attempt to all field', 400, null)
            } else {
                await this.seminarService.update(plann, plan.toLowerCase())
                return res.sendSuccess({}, `Plan updated`)
            }
        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private highlightUpdate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { plan, hightlight } = req?.body
            if(!mongoose.isValidObjectId(plan)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }

            if(!hightlight)
            {                
                responseFormat('Attempt to all field', 400, null)
            } else {
                await this.seminarService.updateHightlight(plan, hightlight)
                return res.sendSuccess({}, `Plan hightlight updated`)
            }
        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private removeHighlight = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { plan, highlight } = req?.body
            if(!mongoose.isValidObjectId(plan)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }

            if(!highlight)
            {                
                responseFormat('Attempt to all field', 400, null)
            } else {
                await this.seminarService.removeHighlight(plan, highlight)
                return res.sendSuccess({}, `Plan hightlight removed`)
            }
        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private restoredHighlight = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { plan, highlight } = req?.body
            if(!mongoose.isValidObjectId(plan)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }

            if(!highlight)
            {                
                responseFormat('Attempt to all field', 400, null)
            } else {
                await this.seminarService.restoreHighlight(plan, highlight)
                return res.sendSuccess({}, `Plan hightlight restored`)
            }
        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private deleteHighlight = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
          const { plan, highlight } = req?.body
          if(!mongoose.isValidObjectId(plan)) 
          {    
            responseFormat('Invalid parameter passed', 400, null)
          }

          if(!highlight)
          {                
            responseFormat('Attempt to all field', 400, null)
          } else {
             await this.seminarService.deleteHighlight(plan, highlight)
             return res.sendSuccess({}, `Plan hightlight deleted`)
          }
        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    
}

export default SeminarController;