import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import DepartmentService from "@/service/management/department.service";
import mongoose from "mongoose";
import { errorProps, responseFormat } from "@/utils/response-format";


class DepartmentController implements IController {

    public path = '/department';
    public router = Router();
    private departmentService = new DepartmentService();

    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.departments)

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
        this.router.put(`${this.path}/delete`,
            // validateMiddleware(validate.register),
            this.delete
        )
        this.router.get(`${this.path}/roles/:department`,
            // validateMiddleware(validate.register),
            this.roles
        )
    }

    private departments = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const categories = await this.departmentService.departments(Number(page), Number(limit))
        return res.sendSuccess(categories, `All departments`)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { name, description } = req?.body
            if(!name || !description)
            {                
                responseFormat('Attempt to all field', 400, null)
            } else {
                const NewlyCreated = await this.departmentService.create(name.toLowerCase(), description.toLowerCase())
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
            const { department, name, description } = req?.body
            if(!mongoose.isValidObjectId(department)) 
            { 
                responseFormat('Invalid parameter passed', 400, null)
            }

            if(!name || !description)
            {                
                responseFormat('Attempt to all field', 400, null)

            } else {
                await this.departmentService.update(department, name.toLowerCase(), description.toLowerCase())
                return res.sendSuccess({}, `Department updated`)
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
            const { department } = req?.body
            if(!mongoose.isValidObjectId(department) || !department) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.departmentService.remove(department)
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
            const { department } = req?.body
            if(!mongoose.isValidObjectId(department) || !department) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.departmentService.restore(department)
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
           const { department } = req?.body
           if(!mongoose.isValidObjectId(department) || !department) 
           {    
              responseFormat('Invalid parameter passed', 400, null)
           } else {
               const deetedAt = await this.departmentService.delete(department)
               return res.sendSuccess({}, `${deetedAt} permanently deleted`)
           }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }

    private roles = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const department = req.params.department
            if(!mongoose.isValidObjectId(department) || !department) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const DepartmentRoles = await this.departmentService.roles(department)
                return res.sendSuccess(DepartmentRoles, `Department roles`)
            }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }      

}

export default DepartmentController;