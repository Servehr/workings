import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import LgaService from "@/service/management/location/lga.service";
import mongoose from "mongoose";


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
        const categories = await this.lgaService.lgas();
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: 'All Local Government Area',
          data: categories,
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
            const { country, state, name } = req?.body
            if(!name)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt to all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                const NewlyCreated = await this.lgaService.create(country.toLowerCase(), state.toLowerCase(), name.toLowerCase())
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${NewlyCreated} created`,
                    data: { },
                    statusCode: 200
                }
                res.status(200).json(data)
            }
        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: { message: string, data: object, statusCode: number } = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)
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
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            }

            if(!name)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt to all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                await this.lgaService.update(lga, name.toLowerCase())
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Lga updated',
                    data: { },
                    statusCode: 200
                }
                res.status(200).json(data)
            }
        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: { message: string, data: object, statusCode: number } = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)
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
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.lgaService.remove(lga)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${deetedAt} deleted`,
                    data: { },
                    statusCode: 200
                }
                res.status(200).json(data)
            }
        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: { message: string, data: object, statusCode: number } = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)
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
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.lgaService.restore(lga)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${deetedAt} restored`,
                    data: { },
                    statusCode: 200
                }
                res.status(200).json(data)
            }
        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: { message: string, data: object, statusCode: number } = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)
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
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.lgaService.delete(lga)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${deetedAt} permanently deleted`,
                    data: { },
                    statusCode: 200
                }
                res.status(200).json(data)
            }
        } catch (error: any) {
            const err = JSON.parse(error.message)
            const errMsg = err.message 
            const code = err.statusCode
            
            const data: { message: string, data: object, statusCode: number } = 
            {
               message: errMsg,
               data: { },
               statusCode: code
            }
            res.status(code).json(data)
        }
    }    


}

export default LgaController;