import Rexource from "@/model/management/rexource";
import { paginate } from "@/utils/pagination";
import { responseFormat } from "@/utils/response-format";
import Permission from "@/model/management/permission";


class RexourceService {

    
    public async rexources(page: number, limit: number): Promise<Error | String | any>
    {

      const children = 
      {      
         path: 'pages',
         match: { deletedAt: null },
         select: '_id name description'
      }      
      return await paginate(Rexource, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name description', children)    
    }

    public async rexourcesPageAktions(role: string, resource: string)
    {
       const rexource = await Rexource.find({ _id: resource }, '_id name')
         .populate(
           {
             path: 'pages',
             select: '_id name',
             populate: {
               path: 'aktions',
               model: 'Aktion',
               select: '_id name'
             }
           }   
       ).lean()       
       // Designated rexource page action
       const rolePermisson = await Permission.findOne({ role: role }, 'priviledge')
      //  console.log(rolePermisson)
       // Application rexource page action
       const permission = rexource[0]?.pages
      //  console.log(permission)
              
       for(let index = 0; index < permission?.length; index++) 
       {
         let allSelected: number = 0
         let actionLength = 0
         // Application pageId
         let pageId: string = permission[index]?._id
         // console.log(pageId)
         // Application actions
         const pageAktions = permission[index]?.aktions     // actions
         // console.log(pageAktions)
         // deignated actions
         const designateAktions = rolePermisson?.priviledge //  page, actions
         // console.log(designateAktions)

         for(let xedni = 0; xedni < designateAktions.length; xedni++)
         {
            // console.log(designateAktions[xedni])
            // console.log(pageId)
            // console.log(designateAktions[xedni]?.page)
            // console.log("*************************************************")
           if(pageId?.toString() === designateAktions[xedni]?.page?.toString())
           {
             const designatedPageAktion = designateAktions[xedni]?.aktions             
             
             for (let act = 0; act < pageAktions.length; act++) 
             {
               actionLength = act
               if(designatedPageAktion?.includes(pageAktions[act]?._id))
               {
                  allSelected = allSelected + 1
                  Object.assign(pageAktions[act], { status: true })
               } else {
                  Object.assign(pageAktions[act], { status: false })
               }
             }
           }
         }             
         permission[index]['actionLength'] = actionLength+1    
         permission[index]['all'] = allSelected 
       }
       return rexource
    }


    public async create(name: string, description: string): Promise<Error | string | any>
    {
       const rexource = await Rexource.create({ name, description })
       return rexource.name
    }


    public async update(rexource: string, name: string, description: string): Promise<Error | string | any>
    {
        const rexourceToUpdate = await Rexource.findOne({ _id: rexource })
        if(!rexourceToUpdate)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))         
        }
        await Rexource.updateOne({ _id: rexource }, { $set: { name: name, description: description } }) 
        return rexourceToUpdate?.name
    }


    public async remove(rexource: string): Promise<Error | string | any>
    {
        const RemoveRexource = await Rexource.findOne({ _id: rexource })
        if(!RemoveRexource)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Rexource.updateOne({ _id: rexource }, { $set: { deletedAt: new Date() } })
        return RemoveRexource?.name
    }


    public async restore(rexource: string): Promise<Error | string | any>
    {
        const RestoreRexource = await Rexource.findOne({ _id: rexource })
        if(!RestoreRexource)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Rexource.updateOne({ _id: rexource }, { $set: { deletedAt: null } })
        return RestoreRexource?.name
    }


    public async delete(rexource: string): Promise<Error | string | any>
    {
        const DeleteRexource = await Rexource.findOne({ _id: rexource })
        if(!DeleteRexource)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        await Rexource.deleteOne({ _id: rexource })
        return DeleteRexource?.name
    }

    public async resourceRole(resource: string)
    {
      const resourceExist = await Rexource.findOne({ _id: resource })
      if(!resourceExist)
      {
        responseFormat('Invalid request passed', 400, null)       
      } 
      return resourceExist?.roles 
    }
    

}

export default RexourceService;