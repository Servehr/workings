import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import mongoose from "mongoose";
import PageService from "@/service/management/page.service";
import RexourceService from "@/service/management/rexource.service";
import { errorProps, responseFormat } from "@/utils/response-format";



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

        this.router.get(`${this.path}/actions`,
            // validateMiddleware(validate.register),
            this.pageAction
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
        this.router.put(`${this.path}/disconnect-page-from-resource`,
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
        return res.sendSuccess(pages, `Created`);
    }

    private pageAction = async (req: Request,
        res: Response
    ) : Promise<Response | void> => {

        const page = req.query.page as string
        const actions = await this.pageService.pageActions(page)
        return res.sendSuccess(actions, `All page Actions`)
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
                responseFormat('Attempt all field', 400, null)
            } else {
                const NewlyCreated = await this.pageService.create(name.toLowerCase(), description.toLowerCase())
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
            const { page, name, description } = req?.body
            if(!mongoose.isValidObjectId(page)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }

            if(!name || !description)
            {                
               responseFormat('Attempt to all field', 400, null)
            } else {
                await this.pageService.update(page, name.toLowerCase(), description.toLowerCase())
                return res.sendSuccess({}, `Page updated`)
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
            const { page } = req?.body
            if(!mongoose.isValidObjectId(page) || !page) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.pageService.remove(page)
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
            const { page } = req?.body
            if(!mongoose.isValidObjectId(page) || !page) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.pageService.restore(page)
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
            const { rexource, page } = req?.body
            if(!mongoose.isValidObjectId(rexource) && !mongoose.isValidObjectId(page)) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.pageService.delete(rexource, page)
                return res.sendSuccess({}, `${deetedAt} permanently deleted`)
            }
        } catch (error: any) {
                            
             let err = JSON.parse(error.message)
             const { errMsg, code, data } = errorProps(err)
             res.sendError(errMsg, code, data)
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
               responseFormat('Invalid parameter passed', 400, null)
            } 

            if(!Array.isArray(pages) && pages?.length > 0)
            {
               responseFormat('Page(s) has to be an array with one or more page', 400, null)
            }   
            
            const repage = await this.pageService.connectPageToRexource(rexource, pages)
            return res.sendSuccess({}, `${repage}`)

        } catch (error: any) {
                            
             let err = JSON.parse(error.message)
             const { errMsg, code, data } = errorProps(err)
             res.sendError(errMsg, code, data)
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
               responseFormat('Invalid parameter passed', 400, null)
            } 

            if(!Array.isArray(pages) && pages?.length > 0)
            {
               responseFormat('Page(s) has to be an array with one or more page', 400, null)
            }   
            
            const repage = await this.pageService.disconnectPageFromRexource(rexource, pages)
            return res.sendSuccess({}, `${repage}`)
            
        } catch (error: any) {
                            
             let err = JSON.parse(error.message)
             const { errMsg, code, data } = errorProps(err)
             res.sendError(errMsg, code, data)
        }
    }


}

export default PageController;