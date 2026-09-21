import Aktion from "@/model/management/aktion";
import Page from "@/model/management/page"
import { paginate, PaginationOptions } from "@/utils/pagenation";
import { responseFormat } from "@/utils/response-format";


class ActionService {

    
    public async actions(page: number, limit: number): Promise<Error | String | any>
    {
      //  return await Aktion.find(
      //     {  },
      //     { deletedAt: null },
      //     { name: 1, description: 1 }
      //  ) 

      const options: PaginationOptions = 
      {
         currentPage: page || 1,
         limit: limit || 10,
         sort: { _id: -1 },
         populate: [
            { path: 'page', select: '_id name description' }
         ]
      }
      return await paginate<any>(Aktion, { deletedAt: null }, options);       
    }

   //  return await Aktion.find(
   //        {  
   //          $or: [
   //            { "newField": true },
   //            { "newField": { "$exists": false } }
   //          ], 
   //          deletedAt: null   
   //        },
   //        { name: 1, description: 1 }
   //     ) 

    public async create(page: string, name: string, description: string): Promise<Error | string | any>
    {
      const action = await Aktion.create({ page, name, description })
      await Page.updateOne({ _id: page}, 
        { $push: { aktions: action?._id } }, 
        { new: true }
      )
      return name
    }

    public async update(action: string, name: string, description: string): Promise<Error | string | any>
    {
      const actionToUpdate = await Aktion.findOne({ _id: action })
      if(!actionToUpdate)
      {
         responseFormat('Invalid request passed', 400, null)       
      }
      await Aktion.updateOne({ _id: action }, { $set: { name: name, description: description } }) 
      return actionToUpdate?.name
    }


    public async remove(page: string, action: string): Promise<Error | string | any>
    {
      const RemoveAction = await Aktion.findOne({ _id: action })
      if(!RemoveAction)
      {
        responseFormat('Invalid request passed', 400, null)  
      }
      await Aktion.updateOne({ _id: action }, { $set: { deletedAt: new Date() } })
               
      await Page.findByIdAndUpdate(page, 
       { $pull: { aktions: action } }, 
       { new: true }
      )
      return RemoveAction?.name
    }


    public async restore(action: string): Promise<Error | string | any>
    {
       const RestoreAction = await Aktion.findOne({ _id: action })
       if(!RestoreAction)
       {
          responseFormat('Invalid request passed', 400, null)
       }
       await Aktion.updateOne({ _id: action }, { $set: { deletedAt: null } })
       return RestoreAction?.name
    }


    public async delete(page: string, action: string): Promise<Error | string | any>
    {
       const DeleteAction = await Aktion.findOne({ _id: action })
       if(!DeleteAction)
       {
          responseFormat('Invalid request passed', 400, null)
       }
       const PageAction = await Page.findOne({ _id: page })
       if(!PageAction)
       {
          responseFormat('Invalid request passed', 400, null)  
       }
       await Aktion.deleteOne({ _id: action })       
       await Page.findByIdAndUpdate(page, 
        { $pull: { actions: action } }, 
        { new: true }
       )
       return DeleteAction?.name
    } 
    

}

export default ActionService;