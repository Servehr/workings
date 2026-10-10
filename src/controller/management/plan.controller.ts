import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import PlanService from "@/service/plan.service";
import mongoose from "mongoose";
import { errorResponse, responseFormat } from "@/utils/response-format";


class PlanController implements IController {

    public path = '/plan';
    public router = Router();
    private planService = new PlanService();


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

        const plans = await this.planService.plans();
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
                const NewlyCreated = await this.planService.create(plan.toLowerCase(), price.toLowerCase(), highlights)
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
                await this.planService.update(plann, plan.toLowerCase(), price.toLowerCase())
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
                await this.planService.updateHightlight(plan, hightlight)
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
                await this.planService.removeHighlight(plan, highlight)
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
                await this.planService.restoreHighlight(plan, highlight)
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
             await this.planService.deleteHighlight(plan, highlight)
             return res.sendSuccess({}, `Plan hightlight deleted`)
          }
        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    
}

export default PlanController;