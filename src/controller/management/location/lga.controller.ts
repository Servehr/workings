import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import LgaService from "@/service/management/location/lga.service";
import mongoose from "mongoose";
import { errorProps, responseFormat } from "@/utils/response-format";


class LgaController implements IController {

    public path = '/lga';
    public router = Router();
    private lgaService = new LgaService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.lgas)

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

    private lgas = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const categories = await this.lgaService.lgas(Number(page), Number(limit));
        return res.sendSuccess(categories, ``);
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { country, state, name } = req?.body
            if(!name)
            {  
               responseFormat('Attempt to all field', 400, null)
            } else {
               const NewlyCreated = await this.lgaService.create(country.toLowerCase(), state.toLowerCase(), name.toLowerCase())
               return res.sendSuccess(NewlyCreated, `Created`);
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
           const { lga, name } = req?.body
           if(!mongoose.isValidObjectId(lga)) 
           {    
              responseFormat('Invalid parameter passed', 400, null)
           }
           if(!name)
           {             
              responseFormat('Attempt to all field', 400, null)   
           } else {
              await this.lgaService.update(lga, name.toLowerCase())
              return res.sendSuccess('Updated', ``);
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
            const { lga } = req?.body
            if(!mongoose.isValidObjectId(lga)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
               const deetedAt = await this.lgaService.remove(lga)
               return res.sendSuccess(`${deetedAt} deleted`, ``)
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
            const { lga } = req?.body
            if(!mongoose.isValidObjectId(lga)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
               const deetedAt = await this.lgaService.restore(lga)
               return res.sendSuccess(`${deetedAt} restored`, ``)
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
            const { lga } = req?.body
            if(!mongoose.isValidObjectId(lga)) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.lgaService.delete(lga)
                return res.sendSuccess(`${deetedAt} permanently deleted`, `Updated`)
            }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }    


}

export default LgaController;