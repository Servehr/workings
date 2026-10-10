import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import CategoryService from "@/service/management/category.service";
import mongoose from "mongoose";
import { errorProps, responseFormat } from "@/utils/response-format";


class CategoryController implements IController {

    public path = '/category';
    public router = Router();
    private categoryService = new CategoryService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.categories)

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
    }

    private categories = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit
        
        const categories = await this.categoryService.categories(Number(page), Number(limit))
        return res.sendSuccess(categories, `All categories`)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { name, description } = req?.body
            if(!name && !description)
            {    
               responseFormat('Attempt to all field', 400, null)
            }
            const NewlyCreated = await this.categoryService.create(name, description)
            return res.sendSuccess({}, `${NewlyCreated} created`)
            
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
            const { category, name, description } = req?.body
            if(!mongoose.isValidObjectId(category)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                await this.categoryService.update(category, name.toLowerCase(), description.toLowerCase())
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
            const { category } = req?.body
            if(!mongoose.isValidObjectId(category) || !category) 
            { 
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.categoryService.remove(category)
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
                const deetedAt = await this.categoryService.restore(category)
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
            const { category } = req?.body
            if(!mongoose.isValidObjectId(category) || !category) 
            {    
               responseFormat('Invalid parameter passed', 400, null)

            } else {
                const deetedAt = await this.categoryService.delete(category)
                return res.sendSuccess({}, `${deetedAt} permanently deleted`)
            }
        } catch (error: any) {
            
             let err = JSON.parse(error.message)
             const { errMsg, code, data } = errorProps(err)
             res.sendError(errMsg, code, data)
        }
    }    


}

export default CategoryController;