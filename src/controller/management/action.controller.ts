import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import ActionService from "@/service/management/action.service";
import mongoose from "mongoose";
import RexourceService from "@/service/management/rexource.service";
import { errorProps, responseFormat } from "@/utils/response-format";


class ActionController implements IController {

    public path = '/action';
    public router = Router();
    private actionService = new ActionService();
    private rexourceService = new RexourceService();

    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.actions)

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
        this.router.put(`${this.path}/permission`,
            // validateMiddleware(validate.register),
            this.permission
        )
    }

    private actions = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const actions = await this.actionService.actions(Number(page), Number(limit))
        return res.sendSuccess(actions, `Created`)
    } 

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { page, name, description } = req?.body
            if(!mongoose.isValidObjectId(page)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            if(!name || !description)
            {                
                responseFormat('Attempt to all field', 400, null)
            } else {
                const NewlyCreated = await this.actionService.create(page, name.toLowerCase(), description.toLowerCase())
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
            const { action, name, description } = req?.body
            if(!mongoose.isValidObjectId(action)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }

            if(!name || !description)
            {                
                responseFormat('Attempt to all field', 400, null)
            } else {
                await this.actionService.update(action, name.toLowerCase(), description.toLowerCase())
                return res.sendSuccess({}, `Action updated`)
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
            const { page, action } = req?.body
            if(!mongoose.isValidObjectId(action)) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.actionService.remove(page, action)
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
            const { action } = req?.body
            if(!mongoose.isValidObjectId(action)) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.actionService.restore(action)
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
            const { page, action } = req?.body
            if(!mongoose.isValidObjectId(page) || !mongoose.isValidObjectId(action) ) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.actionService.delete(page, action)
                return res.sendSuccess({}, `${deetedAt} permanently deleted`)
            }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)  
        }
    } 

    private permission = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { role, rexource, page, action, status } = req?.body
            const aktions = await this.actionService.permission(role, rexource, page, action, status)
            const resourceActions = await this.rexourceService.rexourcesPageAktions(role, rexource)
            res.sendSuccess(resourceActions, aktions)

        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)  
        }
    } 
    
    


}

export default ActionController;