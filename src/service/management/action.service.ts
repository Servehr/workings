import Aktion from "@/model/management/aktion";
import Page from "@/model/management/page"


class ActionService {

    
    public async actions(): Promise<Error | String | any>
    {
       return await Aktion.find(
          {  
            $or: [
              { "newField": true },
              { "newField": { "$exists": false } }
            ], 
            deletedAt: null   
          },
          { name: 1, description: 1 }
       ) 
    }


    public async create(page: string, name: string, description: string): Promise<Error | string | any>
    {
      const action = await Aktion.create({ name, description })
      await Page.findByIdAndUpdate(page, 
        { $push: { actions: action?._id } }, 
        { new: true }
      )
      return name
    }


    public async update(action: string, name: string, description: string): Promise<Error | string | any>
    {
       const actionToUpdate = await Aktion.findOne({ _id: action })
       if(!actionToUpdate)
       {
          let RESPONSE: { message: string, statusCode: number, data: any } = {
            message: 'Invalid request passed',
            statusCode: 404,
            data: null
          }
          throw new Error(JSON.stringify(RESPONSE))         
        }
        await Aktion.updateOne({ _id: action }, { $set: { name: name, description: description } }) 
        return actionToUpdate?.name
    }


    public async remove(action: string): Promise<Error | string | any>
    {
       const RemoveAction = await Aktion.findOne({ _id: action })
       if(!RemoveAction)
       {
          let RESPONSE: { message: string, statusCode: number, data: any } = 
          {
            message: 'Invalid request passed',
            statusCode: 404,
            data: null
          }
          throw new Error(JSON.stringify(RESPONSE))
        }
        await Aktion.updateOne({ _id: action }, { $set: { deletedAt: new Date() } })
        return RemoveAction?.name
    }


    public async restore(action: string): Promise<Error | string | any>
    {
       const RestoreAction = await Aktion.findOne({ _id: action })
       if(!RestoreAction)
       {
         let RESPONSE: { message: string, statusCode: number, data: any } = 
         {
           message: 'Invalid request passed',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
       }
       await Aktion.updateOne({ _id: action }, { $set: { deletedAt: null } })
       return RestoreAction?.name
    }


    public async delete(page: string, action: string): Promise<Error | string | any>
    {
       const DeleteAction = await Aktion.findOne({ _id: action })
       if(!DeleteAction)
       {
         let RESPONSE: { message: string, statusCode: number, data: any } = 
         {
           message: 'Invalid request passed',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
       }
       const PageAction = await Page.findOne({ _id: page })
       if(!PageAction)
       {
         let RESPONSE: { message: string, statusCode: number, data: any } = 
         {
           message: 'Invalid request passed',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
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