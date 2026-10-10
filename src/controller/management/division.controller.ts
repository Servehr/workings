import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import DivisionService from "@/service/management/division.service";
import mongoose from "mongoose";
import { errorProps, responseFormat } from "@/utils/response-format";


class DivisionController implements IController {

    public path = '/division';
    public router = Router();
    private divisionService = new DivisionService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.divisions)

        this.router.post(`${this.path}/create`,
            // validateMiddleware(validate.register),
            this.create
        )
        this.router.get(`${this.path}/category`, 
            this.categoryDivision
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
        this.router.put(`${this.path}/delete`,
            // validateMiddleware(validate.register),
            this.delete
        )
    }

    private divisions = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        const page = req.query.page
        const limit = req.query.limit

        const divisions = await this.divisionService.divisions(Number(page), Number(limit));
        return res.sendSuccess(divisions, `All Division`)
    }
    
    private categoryDivision = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit
        const cateory = req.query.category as string

        const divisions = await this.divisionService.categoryDivision(cateory, Number(page), Number(limit))
        return res.sendSuccess(divisions, `Division`)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { category, name, description } = req?.body
            if(!name || !description)
            {                
                responseFormat('Account pending activation', 400, null)
            } else {
                const NewlyCreated = await this.divisionService.create(category, name, description)
                return res.sendSuccess({}, `${NewlyCreated} created`)
            }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { division, name, description } = req?.body
            if(!mongoose.isValidObjectId(division)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }

            if(!name || !description)
            {                
               responseFormat('Attempt to all field', 400, null)
            } else {
                await this.divisionService.update(division, name.toLowerCase(), description.toLowerCase())
                return res.sendSuccess({}, `Category updated`)
            }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }

    private remove = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { division } = req?.body
            if(!mongoose.isValidObjectId(division) || !division) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.divisionService.remove(division)
                return res.sendSuccess({}, `${deetedAt} deleted`)
            }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }

    private restore = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { category } = req?.body
            if(!mongoose.isValidObjectId(category) || !category) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.divisionService.restore(category)
                return res.sendSuccess({}, `${deetedAt} restored`)
            }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { category, division } = req?.body
            if(!mongoose.isValidObjectId(category) || !mongoose.isValidObjectId(division)) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.divisionService.delete(category, division)
                return res.sendSuccess({}, `${deetedAt} permanently deleted`)
            }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }    


}

export default DivisionController;