import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import mongoose from "mongoose";
import { errorProps, errorResponse, responseFormat } from "@/utils/response-format";
import CompanyService from "@/service/company.service";


class CompanyController implements IController {

    public path = '/company';
    public router = Router();
    private companyService = new CompanyService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.partners)

        this.router.post(`${this.path}/create`,
            // validateMiddleware(validate.register),
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
        this.router.put(`${this.path}/forever`,
            // validateMiddleware(validate.register),
            this.forever
        )
    }

    private partners = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const jobs = await this.companyService.partners(Number(page), Number(limit));
        return res.sendSuccess(jobs, `All jobs`)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { name, logo } = req?.body;
            const NewlyCreated = await this.companyService.create(name, logo)
            return res.sendSuccess({}, `${NewlyCreated}`)

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
            const { company, name, logo } = req?.body;
            if(!mongoose.isValidObjectId(company)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            const updated = await this.companyService.update(company, name, logo)
            return res.sendSuccess({}, `${updated}`)

        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private remove = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { company } = req?.body;
            if(!mongoose.isValidObjectId(company)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            const removed = await this.companyService.removeCompany(company)
            return res.sendSuccess({}, removed)

        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private restore = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { company } = req?.body;
            if(!mongoose.isValidObjectId(company)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            const restored = await this.companyService.restoreCompany(company)
            return res.sendSuccess({}, restored)

        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private forever = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { company } = req?.body;
            if(!mongoose.isValidObjectId(company)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            const forever = await this.companyService.deleteCompany(company)
            return res.sendSuccess({}, forever)

        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }


       


}

export default CompanyController;