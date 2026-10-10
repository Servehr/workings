import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import mongoose from "mongoose";
import { errorResponse, responseFormat } from "@/utils/response-format";
import FaqService from "@/service/Faq.service";


class FaqController implements IController {

    public path = '/faq';
    public router = Router();
    private faqService = new FaqService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.faqs)

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
        this.router.put(`${this.path}/forever`,
            // validateMiddleware(validate.register),
            this.forever
        )
    }

    private faqs = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const allFaq = await this.faqService.faqs(Number(page), Number(limit));
        return res.sendSuccess(allFaq, `All faqs`)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { title, content } = req?.body;
            const NewlyCreated = await this.faqService.create(title, content)
            return res.sendSuccess({}, `${NewlyCreated}`)

        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { faq, title, content } = req?.body;
            if(!mongoose.isValidObjectId(faq)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            const updated = await this.faqService.update(faq, title, content)
            return res.sendSuccess({}, `${updated}`)

        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private remove = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { faq } = req?.body;
            if(!mongoose.isValidObjectId(faq)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            const removed = await this.faqService.removeFaq(faq)
            return res.sendSuccess({}, removed)

        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private restore = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { faq } = req?.body;
            if(!mongoose.isValidObjectId(faq)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            const restored = await this.faqService.restoreFaq(faq)
            return res.sendSuccess({}, restored)

        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }

    private forever = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { faq } = req?.body;
            if(!mongoose.isValidObjectId(faq)) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            }
            const forever = await this.faqService.deleteFaq(faq)
            return res.sendSuccess({}, forever)

        } catch (error: any) {
            
            errorResponse(res, error)
        }
    }


       


}

export default FaqController;