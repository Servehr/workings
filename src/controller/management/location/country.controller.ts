import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import mongoose from "mongoose";
import CountryService from "@/service/management/location/country.service";
import { errorProps, responseFormat } from "@/utils/response-format";


class CountryController implements IController {

    public path = '/country';
    public router = Router();
    private countryService = new CountryService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.countries)

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

    private countries = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const countries = await this.countryService.countries(Number(page), Number(limit));
        return res.sendSuccess(countries['data'], `All countries`)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { name } = req?.body
            if(!name)
            {                
               responseFormat('Attempt to all field', 400, null)
            } else {
                const NewlyCreated = await this.countryService.create(name.toLowerCase())
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
                await this.countryService.update(country, name.toLowerCase())
                return res.sendSuccess({}, `Country updated`);
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
            const { country } = req?.body
            if(!mongoose.isValidObjectId(country)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.countryService.remove(country)
                return res.sendSuccess({}, `${deetedAt} deleted`);
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
            const { country } = req?.body
            if(!mongoose.isValidObjectId(country)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.countryService.restore(country)
                return res.sendSuccess({}, `${deetedAt} restored`);
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
            const { country } = req?.body
            if(!mongoose.isValidObjectId(country)) 
            {    
              responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.countryService.delete(country)                
                return res.sendSuccess({}, `${deetedAt} permanently deleted`);
            }
        } catch (error: any) {
                    
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }    


}

export default CountryController;