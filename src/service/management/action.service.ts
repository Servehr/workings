import Role from "@/model/management/role";
import Rexource from "@/model/management/rexource";
import Page from "@/model/management/page"
import Aktion from "@/model/management/aktion";
import Permission from "@/model/management/permission";
import Privilege from "@/model/privilege";
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

    public async permission(role: string, rexource: string, page: string, action: any, status: boolean): Promise<Error | string | any>
    {
      const roleExist = await Role.findOne({ _id: role })
      if(!roleExist)
      {
        responseFormat('Invalid request passed', 400, null)
      }
      const rexourceExist = await Rexource.findOne({ _id: rexource })
      if(!rexourceExist)
      {
        responseFormat('Invalid request passed', 400, null)  
      }
      const pageExist = await Page.findOne({ _id: page })
      if(!pageExist)
      {
        responseFormat('Invalid request passed', 400, null)  
      }

      let invalidAction = []
      for (let index = 0; index < action.length; index++) 
      {
        let doesActionExist = Aktion.findById(action[index])
        if(!doesActionExist)
        {
          invalidAction.push(action[index])
        }        
      }

      if(invalidAction?.length > 0)
      {
        const response = { msg: 'invalid parameter passed', data: invalidAction }
        responseFormat(response, 404, null)
      }

      if(Array.isArray(action))
      {       
        if(action?.length === 0)
        {
          responseFormat('Pass at least an action', 400, null)
        }
        if(status)
        {
          let actionIdsToAdd : string[] = []
          
          const doesExist = await Permission.findOne({ role: role })
          if(doesExist && doesExist?.priviledge?.length > 0)
          {
            const pG = doesExist?.priviledge
            let actionPosition: any

            for (let dick = 0; dick < pG.length; dick++) 
            {
              if(pG[dick]?.page?.toString() === page)
              { 
                actionPosition = dick
              }              
            }       

            let actionAlreadyAdded = doesExist?.priviledge[actionPosition]?.aktions

            for(let index = 0; index < action?.length; index++) 
            {
              if(!doesExist?.priviledge[actionPosition]?.aktions?.includes(action[index]))
              {
                actionIdsToAdd.push(action[index])
              }               
            }
            if(actionIdsToAdd?.length > 0)
            { 
              let mergedAddition = [...actionIdsToAdd, ...actionAlreadyAdded]
              const toUpdate = `priviledge.${actionPosition}.aktions`
              await Permission.findOneAndUpdate({ role: role }, { $set: { [toUpdate]: mergedAddition } } )
            }
          }            
          if(doesExist && doesExist?.priviledge?.length === 0)
          {
            const addPriviledge = { page: page, aktions: actionIdsToAdd }
            await Permission.findOneAndUpdate({ role: role }, { $push: { priviledge: addPriviledge } } )
          } 
          if(!doesExist)
          {
            await Permission.create({ role, rexource })            
            const addPriviledge = { page: page, aktions: action }
            await Permission.findOneAndUpdate({ role: role }, { $push: { priviledge: addPriviledge } } )
          }                    

        } else {
           
           let actionToRemove: string[] = []
           let actionAlreadyAdded: string[] = []
           
           const doesExist = await Permission.findOne({ role: role })
           if(!doesExist || (doesExist && doesExist?.priviledge?.length === 0))
           {
              const response = { msg: 'No assigned action, nothing to remove', data: '' }
              responseFormat(response, 400, null)
           }

           if(doesExist && doesExist?.priviledge?.length > 0)
           {
             const pG = doesExist?.priviledge
             let actionPosition: any

             for (let dick = 0; dick < pG.length; dick++) 
             {
               if(pG[dick]?.page?.toString() === page)
               { 
                 actionPosition = dick
               }              
             }     
            
             let actionAlreadyAdded = doesExist?.priviledge[actionPosition]?.aktions

             for(let index = 0; index < action?.length; index++) 
             {
               if(doesExist?.priviledge[actionPosition]?.aktions?.includes(action[index]))
               {
                 actionToRemove.push(action[index])
               }
             }
             
             if(actionToRemove?.length > 0)
             {
               const restoreActions = actionAlreadyAdded.filter((item: string) => !actionToRemove.includes(item?.toString()))                           
               const toUpdate = `priviledge.${actionPosition}.aktions`
               await Permission.findOneAndUpdate({ role: role }, { $set: { [toUpdate]: restoreActions } } )
             }
           }
        }
        
      } else {

        if(status)
        {
          let actionIdsToAdd = []  
          let actionAlreadyAddedToPage: string[] = []   
          let actionPosition: number = -1     

          const doesExist = await Permission.findOne({ role: role })  

          const pG = doesExist?.priviledge
          if(doesExist?.priviledge?.length > 0)
          {
            for (let dick = 0; dick < pG.length; dick++) 
            {
              if(pG[dick]?.page?.toString() === page)
              { 
                actionPosition = dick
                actionAlreadyAddedToPage = pG[dick]?.aktions
              }              
            }
            if(!doesExist?.priviledge[actionPosition]?.aktions?.includes(action))
            {
               actionIdsToAdd.push(action)
            }
            if(actionIdsToAdd)
            {
              let mergedAddition = [...actionIdsToAdd, ...actionAlreadyAddedToPage]
              const toUpdate = `priviledge.${actionPosition}.aktions`
              await Permission.findOneAndUpdate({ role: role }, { $set: { [toUpdate]: mergedAddition } } )
            }          
          } 

          if(doesExist && doesExist?.priviledge?.length === 0)
          {
            const theAction = { page: page, aktions: [action] }
            await Permission.findOneAndUpdate({ role: role }, { $push: { priviledge: theAction } } ) 
          }    

          if(!doesExist)
          { 
            await Permission.create({ role, rexource })
            const theAction = { page: page, aktions: [action] }
            await Permission.findOneAndUpdate({ role: role }, { $push: { priviledge: theAction } } )
          }       

        } else {
          
          const doesExist = await Permission.findOne({ role: role }) 
          let actionPosition: number = -1   
          let actionAlreadyAddedToPage: string[] = []  
          let actionToRemove: string = ""
          
          if(!doesExist || (doesExist && doesExist?.priviledge?.length === 0))
          {
            const response = { msg: 'No assigned action, nothing to remove', data: '' }
            responseFormat(response, 400, null)
          }

          const pG = doesExist?.priviledge
          
          if(doesExist?.priviledge?.length > 0)
          {
            for(let dick = 0; dick < pG.length; dick++) 
            {
              if(pG[dick]?.page?.toString() === page)
              { 
                actionPosition = dick
                actionAlreadyAddedToPage = pG[dick]?.aktions
              }              
            }
            if(doesExist?.priviledge[actionPosition]?.aktions?.includes(action))
            {
               actionToRemove = action
            }
            if(actionToRemove)
            {
              const restoreActions = actionAlreadyAddedToPage.filter((item: string) => item?.toString() !== actionToRemove?.toString());                         
              const toUpdate = `priviledge.${actionPosition}.aktions`
              await Permission.findOneAndUpdate({ role: role }, { $set: { [toUpdate]: restoreActions } } )
            }          
          }           

        }
      }
       
      return 'Action Successful'
    } 
    

}

export default ActionService;