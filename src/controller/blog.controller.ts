import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import BlogService from "@/service/blog.service";
import mongoose from "mongoose";
import { errorProps } from "@/utils/response-format";


class BlogPostController implements IController {

    public path = '/post';
    public router = Router();
    private blogService = new BlogService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.posts)

        this.router.post(`${this.path}/create`,
            // validateMiddleware(validate.register),
            this.create
        )
        this.router.put(`${this.path}/update`,
            // validateMiddleware(validate.register),
            this.updatePost
        )
        this.router.get(`${this.path}/post/:post`,
            // validateMiddleware(validate.register),
            this.blogPost
        )
        this.router.put(`${this.path}/remove`,
            // validateMiddleware(validate.register),
            this.removeBlogPost
        )
        this.router.put(`${this.path}/restore`,
            // validateMiddleware(validate.register),
            this.restoreBlogPost
        )
        this.router.put(`${this.path}/delete`,
            // validateMiddleware(validate.register),
            this.deleteBlogPost
        )
    }

    private posts = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const blogPosts = await this.blogService.blogs(Number(page), Number(limit));
        return res.sendSuccess(blogPosts, `Created`);
    }

    private blogPost = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        const post = req.params.post
        const plans = await this.blogService.blogPost(post);
        return res.sendSuccess(plans, ``)
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
           const { name, description, images } = req?.body;
           const NewlyCreated = await this.blogService.create(name, description, images)
           return res.sendSuccess(NewlyCreated, `Created`);
            
        } catch (error: any) {
                  
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }

    private updatePost = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        const { post, name, description } = req.body
        const updatedPost = await this.blogService.update(post, name, description);
        return res.sendSuccess(updatedPost, `Updated`);
    }

    private removeBlogPost = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { post } = req.body
       const removed = await this.blogService.remove(post);
       return res.sendSuccess(removed, `Removed`);
    }

    private restoreBlogPost = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { post } = req.body
       await this.blogService.restore(post);
       return res.sendSuccess({}, `Blog post restored`)
    }

    private deleteBlogPost = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

       const { post } = req.body
       await this.blogService.delete(post);
       return res.sendSuccess({}, `Blog post permanently deleted`)
    }


       


}

export default BlogPostController;