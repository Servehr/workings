import Category from "@/model/management/category";
import { paginate } from "@/utils/pagination";
import mongoose from "mongoose";




class CategoryService {

    
    public async categories(page: number, limit: number): Promise<Error | String | any>
    {
      // return await Category.find(
      //     {  
      //       $or: [
      //         { "newField": true },
      //         { "newField": { "$exists": false } }
      //       ], 
      //       deletedAt: null   
      //     },
      //     { name: 1, description: 1 }
      //  ).populate({
      //       path: 'divisions',
      //       match: { deletedAt: null },
      //       select: '_id name description'
      //  })
      
      const children = {      
         path: 'divisions',
         match: { deletedAt: null },
         select: '_id name description'
      }
      return await paginate(Category, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name description', children)    
    }


    public async create(name: string, description: string): Promise<Error | string | any>
    {
      await Category.create({ name, description })
      return name
    }


    public async update(category: string, name: string, description: string): Promise<Error | string | any>
    {
       const categoryToUpdate = await Category.findOne({ _id: category })
       if(!categoryToUpdate)
       {
          let RESPONSE: { message: string, statusCode: number, data: any } = {
            message: 'Invalid request passed 3',
            statusCode: 404,
            data: null
          }
          throw new Error(JSON.stringify(RESPONSE))         
        }
        await Category.updateOne({ _id: category }, { $set: { name: name, description: description } }) 
        return categoryToUpdate?.name
    }


    public async remove(category: string): Promise<Error | string | any>
    {
       const RemoveCategory = await Category.findOne({ _id: category })
       if(!RemoveCategory)
       {
          let RESPONSE: { message: string, statusCode: number, data: any } = 
          {
            message: 'Invalid request passed',
            statusCode: 404,
            data: null
          }
          throw new Error(JSON.stringify(RESPONSE))
        }
        await Category.updateOne({ _id: category }, { $set: { deletedAt: new Date() } })
        return RemoveCategory?.name
    }


    public async restore(category: string): Promise<Error | string | any>
    {
        const RestoreCategory = await Category.findOne({ _id: category })
        if(!RestoreCategory)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Category.updateOne({ _id: category }, { $set: { deletedAt: null } })
        return RestoreCategory?.name
    }


    public async delete(category: string): Promise<Error | string | any>
    {
        const DeleteCategory = await Category.findOne({ _id: category })
        if(!DeleteCategory)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Category.deleteOne({ _id: category })
        return DeleteCategory?.name
    }    
    

}

export default CategoryService;