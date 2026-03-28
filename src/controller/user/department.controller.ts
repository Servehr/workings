import { Router, Request, Response, NextFunction } from "express";
import IController from "@/interfaceIController";
import authenticateMiddleware from "@/middleware/validation/authenticated.middleware";
import DepartmentService from "@/service/department.service";


class DepartmentController implements IController {

    public path = '/'

    public router = Router();
    private departmentService = new DepartmentService();

    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}departments`, authenticateMiddleware, this.departments)
    }
    
    private departments = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => 
    {
        const allUsers = await this.departmentService.categories()
        res.status(200).json(allUsers)
    }

}

export default DepartmentController;