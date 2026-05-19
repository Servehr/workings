import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import RoleService from "@/service/management/role.service";
import mongoose from "mongoose";


class RoleController implements IController {

    public path = '/role';
    public router = Router();
    private roleService = new RoleService();

    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.get(`${this.path}`, this.roles)

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
        this.router.post(`${this.path}/assign-department`,
            // validateMiddleware(validate.register),
            this.assignRoleToDeparement
        )
    }

    private roles = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        const categories = await this.roleService.roles();
        const data: { message: string, data: object, statusCode: number } = 
        {
          message: 'All Roles',
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
            const { name, description } = req?.body
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
                const NewlyCreated = await this.roleService.create(name.toLowerCase(), description.toLowerCase())
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
            const { role, name, description } = req?.body
            if(!mongoose.isValidObjectId(role)) 
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
                await this.roleService.update(role, name.toLowerCase(), description.toLowerCase())
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: 'Role updated',
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
            const { role } = req?.body
            if(!mongoose.isValidObjectId(role) || !role) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.roleService.remove(role)
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
            const { role } = req?.body
            if(!mongoose.isValidObjectId(role) || !role) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.roleService.restore(role)
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
            const { role } = req?.body
            if(!mongoose.isValidObjectId(role) || !role) 
            {    
               const data: { message: string, data: object, statusCode: number } = 
               {
                  message: 'Invalid parameter passed',
                  data: { },
                  statusCode: 404
               }
               res.status(404).json(data)
            } else {
                const deetedAt = await this.roleService.delete(role)
                const data: { message: string, data: object, statusCode: number } = 
                {
                    message: `${deetedAt} permanently deleted`,
                    data: { },
                    statusCode: 200
                }
                res.status(200).json(data)
            }
        } catch (error: any) {
        }
    }

    private assignRoleToDeparement = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {

            const { department, role } = req?.body
            if(!mongoose.isValidObjectId(department) && !!mongoose.isValidObjectId(role)) 
            {    
            const data: { message: string, data: object, statusCode: number } = 
            {
                message: 'Invalid parameter passed',
                data: { },
                statusCode: 404
            }
            res.status(404).json(data)
            } else {
            const departmentRoles = await this.roleService.DepartmentRoleAssignment(department, role)
            const data: { message: string, data: object, statusCode: number } = 
            {
                message: departmentRoles!,
                data: {  },
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

export default RoleController;