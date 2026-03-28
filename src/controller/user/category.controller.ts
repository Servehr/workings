import { Router, Request, Response, NextFunction } from "express";
import IController from "@/interfaceIController";
import authenticateMiddleware from "@/middleware/validation/authenticated.middleware";
import CategoryService from "@/service/category.service";


class CategoryController implements IController {

    public path = '/'

    public router = Router();
    private categoryService = new CategoryService();

    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}categories`, authenticateMiddleware, this.categories)
    }
    
    private categories = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => 
    {
        const allUsers = await this.categoryService.categories()
        res.status(200).json(allUsers)
    }

}

export default CategoryController;