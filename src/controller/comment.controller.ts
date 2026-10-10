import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import { errorProps } from "@/utils/response-format";
import CommentService from "@/service/comment.service";


class CommentController implements IController {

    public path = '/comment';
    public router = Router();
    private commentService = new CommentService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.comments)

        this.router.post(`${this.path}/create`,
            // validateMiddleware(validate.register),
            this.create
        )
        this.router.put(`${this.path}/update`,
            // validateMiddleware(validate.register),
            this.update
        )
        this.router.post(`${this.path}/remove`,
            // validateMiddleware(validate.register),
            this.remove
        )
    }

    private comments = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const coments = await this.commentService.comments(Number(page), Number(limit));
        return res.sendSuccess(coments, `Created`)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { post, comment } = req?.body
            const user = ''
            await this.commentService.create(user, post, comment)
            return res.sendSuccess({}, `Created`);

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
            const { commentId, comment } = req?.body
            await this.commentService.update(commentId, comment)
            return res.sendSuccess({}, `Updated`);

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
            const { about } = req?.body
            await this.commentService.remove(about)
            return res.sendSuccess({}, `Removed`);

        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }
       


}

export default CommentController;