import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import DivisionService from "@/service/management/division.service";
import mongoose from "mongoose";


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
        console.log("c")
        const page = req.query.page
        const limit = req.query.limit

        console.log("Checking what happened")

        const divisions = await this.divisionService.divisions(Number(page), Number(limit));
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: 'All Division',
          data: divisions,
          statusCode: 200
        }
        res.status(200).json(data)
    }
    
    private categoryDivision = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        console.log("a")
        const page = req.query.page
        const limit = req.query.limit
        const cateory = req.query.category as string

        const divisions = await this.divisionService.categoryDivision(cateory, Number(page), Number(limit))
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: 'Division',
          data: divisions,
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
            console.log("b")
            const { category, name, description } = req?.body
            console.log(req?.body)
            if(!name || !description)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt to all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                const NewlyCreated = await this.divisionService.create(category, name, description)
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
            console.log("d")
            const { division, name, description } = req?.body
            if(!mongoose.isValidObjectId(division)) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            }

            if(!name || !description)
            {                
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt to all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                await this.divisionService.update(division, name.toLowerCase(), description.toLowerCase())
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Category updated',
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
            console.log("e")
            const { division } = req?.body
            if(!mongoose.isValidObjectId(division) || !division) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed 11',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.divisionService.remove(division)
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
            console.log("f")
            const { category } = req?.body
            if(!mongoose.isValidObjectId(category) || !category) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.divisionService.restore(category)
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
            console.log("g")
            const { category, division } = req?.body
            if(!mongoose.isValidObjectId(category) || !mongoose.isValidObjectId(division)) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.divisionService.delete(category, division)
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

export default DivisionController;