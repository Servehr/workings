import Rexource from "@/model/rexource";




class RexourceService {

    
    public async rexources(): Promise<Error | String | any>
    {
        return await Rexource.find(
          {  
            $or: [
              { "newField": true },
              { "newField": { "$exists": false } }
            ], 
            deletedAt: null   
          },
          { name: 1, description: 1, pages: 1 }
        ).populate({
            path: 'pages',
            match: { deletedAt: null },
            select: '_id name description'
        })
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