import Category from "@/model/management/category";
import Division from "@/model/management/division";
import { paginate } from "@/utils/pagination";


class DivisionService {

    
    public async divisions(page: number, limit: number): Promise<Error | String | any>
    {
       return await paginate(Division, { deletedAt: null }, { page: page, limit: 30, sort: { _id: -1 } }, '_id category name description', null)
    }

    public async categoryDivision(category: string, page: number, limit: number): Promise<Error | String | any>
    {
       return await paginate(Division, { category: category, deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name description', null)
    }

    public async create(category: string, name: string, description: string): Promise<Error | string | any>
    {
       const division = await Division.create({ category, name, description })
       await Category.findByIdAndUpdate(category, 
         { $push: { divisions: division?._id } }, 
         { new: true }
       )
       return name
    }


    public async update(division: string, name: string, description: string): Promise<Error | string | any>
    {
       const divisionToUpdate = await Division.findOne({ _id: division })
       if(!divisionToUpdate)
       {
          let RESPONSE: { message: string, statusCode: number, data: any } = {
            message: 'Invalid request passed',
            statusCode: 404,
            data: null
          }
          throw new Error(JSON.stringify(RESPONSE))         
        }
        await Division.updateOne({ _id: division }, { $set: { name: name, description: description } }) 
        return divisionToUpdate?.name
    }


    public async remove(division: string): Promise<Error | string | any>
    {
       const RemoveDivision = await Division.findOne({ _id: division })
       if(!RemoveDivision)
       {
          let RESPONSE: { message: string, statusCode: number, data: any } = 
          {
            message: 'Invalid request passed 1',
            statusCode: 404,
            data: null
          }
          throw new Error(JSON.stringify(RESPONSE))
        }
        await Division.updateOne({ _id: division }, { $set: { deletedAt: new Date() } })
        return RemoveDivision?.name
    }


    public async restore(division: string): Promise<Error | string | any>
    {
        const RestoreDivision = await Division.findOne({ _id: division })
        if(!RestoreDivision)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Division.updateOne({ _id: division }, { $set: { deletedAt: null } })
        return RestoreDivision?.name
    }


    public async delete(category: string, division: string): Promise<Error | string | any>
    {
       const DeleteDivision = await Division.findOne({ _id: division })
       if(!DeleteDivision)
       {
         let RESPONSE: { message: string, statusCode: number, data: any } = 
         {
           message: 'Invalid request passed',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
       }
       const Categ = await Category.findOne({ _id: category })
       if(!Categ)
       {
         let RESPONSE: { message: string, statusCode: number, data: any } = 
         {
           message: 'Invalid request passed',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
       }
       await Division.deleteOne({ _id: division })       
       await Category.findByIdAndUpdate(category, 
        { $pull: { divisions: division } }, 
        { new: true }
       )
       return DeleteDivision?.name      
    }

}

export default DivisionService;