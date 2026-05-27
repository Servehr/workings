import Role from "@/model/role";
import Privilege from "@/model/privilege";
import Department from "@/model/department";
import mongoose from "mongoose";
import { paginate } from "@/utils/pagination";




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

    public async DepartmentRoleAssignment(department: string, role: string)
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
    

}

export default RoleService;