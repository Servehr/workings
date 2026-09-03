import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import AboutService from "@/service/cms/about.service";
import mongoose from "mongoose";
import { errorProps } from "@/utils/response-format";


class AboutController implements IController {

    public path = '/about';
    public router = Router();
    private aboutService = new AboutService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.aboutus)

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

    private aboutus = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        const about = await this.aboutService.aboutus();
        return res.sendSuccess(about, `Created`);
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try 
        {
            const { title, aboutus, images } = req?.body
            await this.aboutService.create(title, aboutus, images)
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
            const { about, title, aboutus, image } = req?.body
            await this.aboutService.update(about, title, aboutus, image)
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
            await this.aboutService.remove(about)
            return res.sendSuccess({}, `Removed`);

        } catch (error: any) {
            
            let err = JSON.parse(error.message)
            const { errMsg, code, data } = errorProps(err)
            res.sendError(errMsg, code, data)
        }
    }
       


}

export default AboutController;