import Role from "@/model/management/role";
import Privilege from "@/model/privilege";
import Department from "@/model/department";
import Rexource from "@/model/management/rexource";
import mongoose from "mongoose";
import { paginate } from "@/utils/pagination";
import { responseFormat } from "@/utils/response-format";




class RoleService {

    
    public async roles(page: number, limit: number): Promise<Error | String | any>
    {
      return await paginate(Role, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name description', null)    
    }


    public async create(name: string, description: string): Promise<Error | string | any>
    {
      await Role.create({ name, description })
      return name
    }


    public async update(role: string, name: string, description: string): Promise<Error | string | any>
    {
       const roleToUpdate = await Role.findOne({ _id: role })
       if(!roleToUpdate)
       {
          let RESPONSE: { message: string, statusCode: number, data: any } = {
            message: 'Invalid request passed',
            statusCode: 404,
            data: null
          }
          throw new Error(JSON.stringify(RESPONSE))         
        }
        await Role.updateOne({ _id: role }, { $set: { name: name, description: description } }) 
        return roleToUpdate?.name
    }


    public async remove(role: string): Promise<Error | string | any>
    {
       const RemoveRole = await Role.findOne({ _id: role })
       if(!RemoveRole)
       {
          let RESPONSE: { message: string, statusCode: number, data: any } = 
          {
            message: 'Invalid request passed',
            statusCode: 404,
            data: null
          }
          throw new Error(JSON.stringify(RESPONSE))
        }
        await Role.updateOne({ _id: role }, { $set: { deletedAt: new Date() } })
        return RemoveRole?.name
    }


    public async restore(role: string): Promise<Error | string | any>
    {
        const RestoreRole = await Role.findOne({ _id: role })
        if(!RestoreRole)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Role.updateOne({ _id: role }, { $set: { deletedAt: null } })
        return RestoreRole?.name
    }


    public async delete(role: string): Promise<Error | string | any>
    {
        const DeleteRole = await Role.findOne({ _id: role })
        if(!DeleteRole)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Role.deleteOne({ _id: role })
        return DeleteRole?.name
    }

    public async departmentRoleAssignment(department: string, role: string)
    {
       const dept = await Department.findById(department)
       if(!dept)
       {
         let RESPONSE: { message: string, statusCode: number, data: any } = 
         {
           message: 'Invalid request passed',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
       }

       const rhole = await Role.findById(role)
       if(!rhole)
       {
          let RESPONSE: { message: string, statusCode: number, data: any } = 
          {
            message: 'Invalid request passed',
            statusCode: 404,
            data: null
          }
          throw new Error(JSON.stringify(RESPONSE))
       }

       const DepartmentRoles = dept?.roles
       let RoleIds: string[] = []       
       
       if(DepartmentRoles?.length === 0)
       {
         await Department.findByIdAndUpdate(department, 
           { $push: { roles: role } }, 
           { new: true }
         )
         let message = `${rhole?.name} attached to ${dept?.name}`
         return message         
       }

       if(DepartmentRoles?.length > 0)
       {
         for (let index = 0; index < DepartmentRoles?.length; index++) 
         {
            RoleIds.push(DepartmentRoles[index]?._id?.toString())        
         }

         let HasRole: string = ''
         if(RoleIds?.includes(role))
         {
           HasRole = role
         }

         let message: string = ''

         if(HasRole)
         {
            await Department.findByIdAndUpdate(department, 
              { $pull: { roles: role } }, 
              { new: true }
            )
            message = `${rhole?.name} removed from ${dept?.name}`
         } else {
            await Department.findByIdAndUpdate(department, 
              { $push: { roles: role } }, 
              { new: true }
            )
            message = `${rhole?.name} added to ${dept?.name}`
         } 
         return message
       } 
      
      //  const checkAssignment = await Privilege.findOne({ department: department, role: role })
      //  if(checkAssignment)
      //  {
      //    let RESPONSE: { message: string, statusCode: number, data: any } = 
      //    {
      //       message: 'Role already assigned department',
      //       statusCode: 404,
      //       data: null
      //    }
      //    throw new Error(JSON.stringify(RESPONSE))
      //  }
      //  await Privilege.create({ department, role })
      //  const msg: string = `${dept.name} assigned to ${rhole.name}`
      //  return msg
    }    

    public async roleResourceLink(role: string, resource: string)
    {
      const roleExist = await Role.findOne({ _id: role })
      if(!roleExist)
      {
        responseFormat('Invalid request passed', 400, null)       
      }  
      const resourceExist = await Rexource.findOne({ _id: resource })
      if(!resourceExist)
      {
        responseFormat('Invalid request passed', 400, null)       
      }  
      const existingResources = roleExist?.rexources
      if(roleExist?.rexources?.length > 0)
      {
        if(existingResources?.includes(resource))
        {
          responseFormat(`${roleExist?.name} already has ${resourceExist?.name}`, 400, null) 
        }
      }
      await Role.findByIdAndUpdate(role, 
        { $push: { rexources: resource } }, 
        { new: true }
      )
      return `${resourceExist?.name} linked to ${roleExist?.name}`
    }

    public async roleResourceUnlink(role: string, resource: string)
    {
      const roleExist = await Role.findOne({ _id: role })
      if(!roleExist)
      {
        responseFormat('Invalid request passed', 400, null)       
      }  
      const resourceExist = await Rexource.findOne({ _id: resource })
      if(!resourceExist)
      {
        responseFormat('Invalid request passed', 400, null)       
      }  
      const existingResources = roleExist?.rexources
      if(roleExist?.rexources?.length === 0)
      {
         responseFormat(`${roleExist?.name} currently does not have any resource link to it`, 400, null)
      }
      if(roleExist?.rexources?.length > 0)
      {
        if(!existingResources?.includes(resource))
        {
           responseFormat(`${resourceExist?.name} is not associated with ${roleExist?.name}`, 400, null) 
        } else {
           await Role.findByIdAndUpdate(role, 
             { $pull: { rexources: resource } }, 
             { new: true }
           )
           return `${resourceExist?.name} unlinked from ${roleExist?.name}`
        }
      }
    }

    public async roleResources(role: string)
    {
      const roleExist = await Role.findOne({ _id: role })
      if(!roleExist)
      {
        responseFormat('Invalid request passed', 400, null)       
      }  
      return roleExist?.rexources 
    }
    

}

export default RoleService;