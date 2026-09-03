import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import mongoose from "mongoose";
import PageService from "@/service/management/page.service";
import RexourceService from "@/service/management/rexource.service";



class PageController implements IController {

    public path = '/page';
    public router = Router();
    private pageService = new PageService();
    private rexourceService = new RexourceService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.pages)

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
        this.router.put(`${this.path}/connect-page-to-resource`,
            // validateMiddleware(validate.register),
            this.connectToResource
        )
        this.router.put(`${this.path}/disconnect-from-resource`,
            // validateMiddleware(validate.register),
            this.disconnectFromResource
        )
        
    }

    private pages = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit
        const pages = await this.pageService.pages(Number(page), Number(limit));
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: 'All Pages',
          data: pages,
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
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Attempt all field',
                    data: { },
                    statusCode: 404
                }
                res.status(404).json(data)
            } else {
                const NewlyCreated = await this.pageService.create(name.toLowerCase(), description.toLowerCase())
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
            const { page, name, description } = req?.body
            if(!mongoose.isValidObjectId(page)) 
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
                await this.pageService.update(page, name.toLowerCase(), description.toLowerCase())
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Page updated',
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
            const { page } = req?.body
            if(!mongoose.isValidObjectId(page) || !page) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.pageService.remove(page)
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
            const { page } = req?.body
            if(!mongoose.isValidObjectId(page) || !page) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.pageService.restore(page)
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
            const { rexource, page } = req?.body
            if(!mongoose.isValidObjectId(rexource) && !mongoose.isValidObjectId(page)) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.pageService.delete(rexource, page)
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

    private connectToResource = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { rexource, pages } = req?.body
            if(!mongoose.isValidObjectId(rexource) || !rexource) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } 

            if(!Array.isArray(pages) && pages?.length > 0)
            {
               let RESPONSE: { message: string, statusCode: number, data: any } = 
               {
                  message: 'Page(s) has to be an array with one or more page',
                  statusCode: 404,
                  data: null
               }
               throw new Error(JSON.stringify(RESPONSE))
            }   
            
            const repage = await this.pageService.connectPageToRexource(rexource, pages)
            const data: { message: string, data: object, statusCode: number } = 
             {
                message: `${repage} >`,
                data: { },
                statusCode: 200
             }
            res.status(200).json(data)

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
        
    private disconnectFromResource = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { rexource, pages } = req?.body
            if(!mongoose.isValidObjectId(rexource) || !rexource) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } 

            if(!Array.isArray(pages) && pages?.length > 0)
            {
               let RESPONSE: { message: string, statusCode: number, data: any } = 
               {
                  message: 'Page(s) has to be an array with one or more page',
                  statusCode: 404,
                  data: null
               }
               throw new Error(JSON.stringify(RESPONSE))
            }   
            
            const repage = await this.pageService.disconnectPageFromRexource(rexource, pages)
            const data: { message: string, data: object, statusCode: number } = 
             {
                message: `${repage}`,
                data: { },
                statusCode: 200
             }
            res.status(200).json(data)
            
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

export default PageController;