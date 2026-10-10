import State from "@/model/management/state";
import Lga from "@/model/management/lga";
import { responseFormat } from "@/utils/response-format";



class LgaService {

    
    public async lgas(page: number, limit: number): Promise<Error | String | any>
    {
        return await Lga.find(
          {  
            $or: [
              { "newField": true },
              { "newField": { "$exists": false } }
            ], 
            deletedAt: null   
          },
          { name: 1 }
        )
    }


    public async create(country: string, state: string, name: string): Promise<Error | string | any>
    {
       const NewLga = await Lga.create({ country, state, name })
       await State.findByIdAndUpdate(state, 
         { $push: { lgas: NewLga?.id } }, 
         { new: true }
       )       
       return name       
    }


    public async update(lga: string, name: string): Promise<Error | string | any>
    {
        const LgaToUpdate = await Lga.findOne({ _id: lga })
        if(!LgaToUpdate)
        {
           responseFormat('Invalid request passed', 400, null)        
        }
        await Lga.updateOne({ _id: lga }, { $set: { name: name } }) 
        return LgaToUpdate?.name
    }


    public async remove(lga: string): Promise<Error | string | any>
    {
        const RemoveLga = await Lga.findOne({ _id: lga })
        if(!RemoveLga)
        {
          responseFormat('Invalid request passed', 400, null)
        }
        await Lga.updateOne({ _id: lga }, { $set: { deletedAt: new Date() } })
        return RemoveLga?.name
    }


    public async restore(lga: string): Promise<Error | string | any>
    {
        const RestoreLga = await Lga.findOne({ _id: lga })
        if(!RestoreLga)
        {
           responseFormat('Invalid request passed', 400, null)
        }
        await Lga.updateOne({ _id: lga }, { $set: { deletedAt: null } })
        return RestoreLga?.name
    }


    public async delete(lga: string): Promise<Error | string | any>
    {
        const DeleteLga = await Lga.findOne({ _id: lga })
        if(!DeleteLga)
        {
           responseFormat('Invalid request passed', 400, null)
        }
        await Lga.deleteOne({ _id: lga })
        return DeleteLga?.name
    }
      
    

}

export default LgaService;