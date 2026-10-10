import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import RexourceService from "@/service/management/rexource.service";
import mongoose from "mongoose";
import { errorProps, errorResponse, responseFormat } from "@/utils/response-format";


class RexourceController implements IController {

    public path = '/rexource';
    public router = Router();
    private rexourceService = new RexourceService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.rexources)

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
        this.router.put(`${this.path}/role-link`,
            // validateMiddleware(validate.register),
            this.resourceRole
        )
        this.router.get(`${this.path}/pages-actions`,
            // validateMiddleware(validate.register),
            this.pagesActions
        )
    }

    private rexources = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const rexource = await this.rexourceService.rexources(Number(page), Number(limit));
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: 'All Resource',
          data: rexource,
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
            const { name, description } = req?.body
            if(!name || !description)
            {                
               responseFormat('Attempt to all field', 400, null)
            } else {
                const NewlyCreated = await this.rexourceService.create(name.toLowerCase(), description.toLowerCase())
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
            const { rexource, name, description } = req?.body
            if(!mongoose.isValidObjectId(rexource)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }

            if(!name || !description)
            {                
                responseFormat('Attempt to all field', 400, null)
            } else {

                await this.rexourceService.update(rexource, name.toLowerCase(), description.toLowerCase())
                return res.sendSuccess({}, `Resource updated`)
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
            const { rexource } = req?.body
            if(!mongoose.isValidObjectId(rexource) || !rexource) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.rexourceService.remove(rexource)
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
            const { rexource } = req?.body
            if(!mongoose.isValidObjectId(rexource) || !rexource) 
            {    
               responseFormat('Invalid parameter passed', 400, null)

            } else {
                const deetedAt = await this.rexourceService.restore(rexource)
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
            const { rexource } = req?.body
            if(!mongoose.isValidObjectId(rexource) || !rexource) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.rexourceService.delete(rexource)
                return res.sendSuccess({}, `${deetedAt} permanently deleted`)
            }
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }   
    
    private resourceRole = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
          const { resource } = req.body
          const roleResources = await this.rexourceService.resourceRole(resource)
          return res.sendSuccess(roleResources, ``)    

        } catch (error: any) {        
            
           errorResponse(res, error)           
        }
    }   
    
    private pagesActions = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {                    
          const role = req.query.role as string
          const resource = req.query.resource as string
          const pagesActions = await this.rexourceService.rexourcesPageAktions(role, resource)
          return res.sendSuccess(pagesActions, ``)
                          
        } catch (error: any) {        

           errorResponse(res, error)           
        }
    }

    


}

export default RexourceController;