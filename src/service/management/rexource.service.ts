import Rexource from "@/model/management/rexource";
import { paginate } from "@/utils/pagination";




class RexourceService {

    
    public async rexources(page: number, limit: number): Promise<Error | String | any>
    {
      const children = {      
         path: 'pages',
         match: { deletedAt: null },
         select: '_id name description'
      }      
      return await paginate(Rexource, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name description', children)    
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
    

}

export default RexourceService;