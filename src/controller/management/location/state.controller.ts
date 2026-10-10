import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import StateService from "@/service/management/location/state.service";
import mongoose from "mongoose";
import { errorProps, responseFormat } from "@/utils/response-format";


class StateController implements IController {

    public path = '/state';
    public router = Router();
    private stateService = new StateService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.states)

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

    private states = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        const categories = await this.stateService.states();
        return res.sendSuccess(categories, `All State`)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { country, name } = req?.body
            if(!name)
            {               
                responseFormat('Attempt to all field', 400, null)
            } else {
                const NewlyCreated = await this.stateService.create(country.toLowerCase(), name.toLowerCase())
                return res.sendSuccess({}, `${NewlyCreated} created`);
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
            const { country, name } = req?.body
            if(!mongoose.isValidObjectId(country)) 
            {  
                responseFormat('Invalid parameter passed', 400, null)
            }

            if(!name)
            {  
                responseFormat('Attempt to all field', 400, null)
            } else {
                await this.stateService.update(country, name.toLowerCase())
                return res.sendSuccess({}, `Country updated`)
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
            const { state } = req?.body
            if(!mongoose.isValidObjectId(state)) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.stateService.remove(state)
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
            const { state } = req?.body
            if(!mongoose.isValidObjectId(state)) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.stateService.restore(state)
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
            const { state } = req?.body
            if(!mongoose.isValidObjectId(state)) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.stateService.delete(state)
                return res.sendSuccess({}, `${deetedAt} permanently restored`)
            }
        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)  
        }
    }    


}

export default StateController;