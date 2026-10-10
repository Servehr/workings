import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import RoleService from "@/service/management/role.service";
import mongoose from "mongoose";
import { errorResponse, responseFormat } from "@/utils/response-format";


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
        this.router.put(`${this.path}/resource-link`,
            // validateMiddleware(validate.register),
            this.RoleResourceLink
        )
        this.router.put(`${this.path}/resource-unlink`,
            // validateMiddleware(validate.register),
            this.RoleResourceUnlink
        )
        this.router.get(`${this.path}/resources`,
            // validateMiddleware(validate.register),
            this.RoleResources
        )
    }

    private roles = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {
        
        const page = req.query.page
        const limit = req.query.limit

        const categories = await this.roleService.roles(Number(page), Number(limit));
        return res.sendSuccess(categories, `All Roles`)
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
                responseFormat('Attempt to all field', 400, null)
            } else {
                const NewlyCreated = await this.roleService.create(name.toLowerCase(), description.toLowerCase())
                return res.sendSuccess({}, `${NewlyCreated} created`)
            }
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
            const { role, name, description } = req?.body
            if(!mongoose.isValidObjectId(role)) 
            {    
                responseFormat('Invalid parameter passed', 400, null)
            }

            if(!name || !description)
            {         
                responseFormat('Attempt to all field', 400, null)
            } else {
                await this.roleService.update(role, name.toLowerCase(), description.toLowerCase())
                return res.sendSuccess({}, `Role update`)
            }
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
            const { role } = req?.body
            
            if(!mongoose.isValidObjectId(role) || !role) 
            {    
               responseFormat('Invalid parameter passed', 400, null)

            } else {
                const deetedAt = await this.roleService.remove(role)
                return res.sendSuccess({}, `${deetedAt} deleted`)
            }
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
            const { role } = req?.body
            if(!mongoose.isValidObjectId(role) || !role) 
            {    
               responseFormat('Invalid parameter passed', 400, null)
            } else {
                const deetedAt = await this.roleService.restore(role)
                return res.sendSuccess({}, `${deetedAt} deleted`)
            }
        } catch (error: any) {
            
            errorResponse(res, error)
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
               responseFormat('Invalid parameter passed', 400, null)

            } else {
                const deetedAt = await this.roleService.delete(role)
                return res.sendSuccess({}, `${deetedAt} permanently deleted`)
            }
        } catch (error: any) {
            
            errorResponse(res, error)
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
                responseFormat('Invalid parameter passed', 400, null)
            } else {
                const departmentRoles = await this.roleService.departmentRoleAssignment(department, role)
                return res.sendSuccess({}, departmentRoles!) 
            }
            
        } catch (error: any) {
            
            errorResponse(res, error)   
        }
    }  
    
    private RoleResourceLink = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        
      try 
      {
         const { role, rexource } = req.body
         const roleResources = await this.roleService.roleResourceLink(role, rexource)
         return res.sendSuccess(roleResources, roleResources)      

      } catch (error: any) {         
         
         errorResponse(res, error)             
      }
    }
    
    private RoleResourceUnlink = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {        
      try 
      {
         const { role, rexource } = req.body
         const roleResourcesLink = await this.roleService.roleResourceUnlink(role, rexource)
         return res.sendSuccess(roleResourcesLink, roleResourcesLink)        
                 
      } catch (error: any) {  

          errorResponse(res, error)           
      }
    }
    
    private RoleResources = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {        
      try 
      {
         const role = req.query.role as string
         const roleResources = await this.roleService.roleResources(role)
         return res.sendSuccess(roleResources, '')          

      } catch (error: any) {        

          errorResponse(res, error)           
      }
    }

}

export default RoleController;