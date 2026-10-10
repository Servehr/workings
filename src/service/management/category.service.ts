import Category from "@/model/management/category";
import { paginate } from "@/utils/pagination";
import { responseFormat } from "@/utils/response-format";




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
          responseFormat('Invalid request passed', 400, null)       
       }
       await Category.updateOne({ _id: category }, { $set: { name: name, description: description } }) 
       return categoryToUpdate?.name
    }


    public async remove(category: string): Promise<Error | string | any>
    {
       const RemoveCategory = await Category.findOne({ _id: category })
       if(!RemoveCategory)
       {
          responseFormat('Invalid request passed', 400, null)
       }
       await Category.updateOne({ _id: category }, { $set: { deletedAt: new Date() } })
       return RemoveCategory?.name
    }


    public async restore(category: string): Promise<Error | string | any>
    {
        const RestoreCategory = await Category.findOne({ _id: category })
        if(!RestoreCategory)
        {
          responseFormat('Invalid request passed', 400, null)
        }
        await Category.updateOne({ _id: category }, { $set: { deletedAt: null } })
        return RestoreCategory?.name
    }


    public async delete(category: string): Promise<Error | string | any>
    {
        const DeleteCategory = await Category.findOne({ _id: category })
        if(!DeleteCategory)
        {
          responseFormat('Invalid request passed', 400, null)
        }
        await Category.deleteOne({ _id: category })
        return DeleteCategory?.name
    }    
    

}

export default CategoryService;