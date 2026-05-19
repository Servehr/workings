import Department from "@/model/department";
import Privilege from "@/model/privilege";




class DepartmentService {

    
    public async departments(): Promise<Error | String | any>
    {
        return await Department.find(
          {  
            $or: [
              { "newField": true },
              { "newField": { "$exists": false } }
            ], 
            deletedAt: null   
          },
          { name: 1, description: 1, roles: 1 }
        ).populate({
            path: 'roles',
            match: { deletedAt: null },
            select: '_id name description'
        }) 
    }


    public async create(name: string, description: string): Promise<Error | string | any>
    {
       await Department.create({ name, description })
       return name
    }


    public async update(department: string, name: string, description: string): Promise<Error | string | any>
    {
        const departmentToUpdate = await Department.findOne({ _id: department })
        if(!departmentToUpdate)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))         
        }
        await Department.updateOne({ _id: department }, { $set: { name: name, description: description } }) 
        return departmentToUpdate?.name
    }


    public async remove(department: string): Promise<Error | string | any>
    {
        const RemoveDepartment = await Department.findOne({ _id: department })
        if(!RemoveDepartment)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Department.updateOne({ _id: department }, { $set: { deletedAt: new Date() } })
        return RemoveDepartment?.name
    }


    public async restore(department: string): Promise<Error | string | any>
    {
        const RestoreDepartment = await Department.findOne({ _id: department })
        if(!RestoreDepartment)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Department.updateOne({ _id: department }, { $set: { deletedAt: null } })
        return RestoreDepartment?.name
    }


    public async delete(department: string): Promise<Error | string | any>
    {
        const DeleteDepartment = await Department.findOne({ _id: department })
        if(!DeleteDepartment)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Department.deleteOne({ _id: department })
        return DeleteDepartment?.name
    }

    public async roles(department: string)
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
       const checkAssignment = await Privilege.findOne({ department: department })
       if(!checkAssignment)
       {
         let RESPONSE: { message: string, statusCode: number, data: any } = 
         {
            message: 'Role already assigned department',
            statusCode: 404,
            data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
       }
       const posts = await Privilege.find({ department: department }, { '_id': 0, 'department': 0, 'createdAt': 0, 'updatedAt': 0, '__v': 0 })
                           .populate([ {  path: 'role',  match: { isDeleted: null }, select: '_id, name' }])
       return posts


    }    
    

}

export default DepartmentService;