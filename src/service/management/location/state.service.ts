import Country from "@/model/management/country";
import State from "@/model/management/state";
import Lga from "@/model/management/lga";
import { responseFormat } from "@/utils/response-format";



class StateService {

    
    public async states(): Promise<Error | String | any>
    {
        return await State.find(
          {  
            $or: [
              { "newField": true },
              { "newField": { "$exists": false } }
            ], 
            deletedAt: null   
          },
          { name: 1 }
        ).populate({
            path: 'lgas',
            match: { deletedAt: null },
            select: '_id name'
        }) 
    }


    public async create(country: string, name: string): Promise<Error | string | any>
    {
       const CountryState = await Country.findOne({ _id: country })
       if(!CountryState)
       {
          responseFormat('Invalid request passed', 400, null)       
       }

       const NewState = await State.create({ name, country })
       await Country.findByIdAndUpdate(country, 
         { $push: { states: NewState?.id } }, 
         { new: true }
       )       
       return name
    }


    public async update(state: string, name: string): Promise<Error | string | any>
    {
        const StateToUpdate = await State.findOne({ _id: state })
        if(!StateToUpdate)
        {
          responseFormat('Invalid request passed', 400, null)        
        }
        await State.updateOne({ _id: state }, { $set: { name: name } }) 
        return StateToUpdate?.name
    }


    public async remove(state: string): Promise<Error | string | any>
    {
        const RemoveState = await State.findOne({ _id: state })
        if(!RemoveState)
        {
          responseFormat('Invalid request passed', 400, null)
        }

        const StateLgas = RemoveState?.lgas
        for (let index = 0; index < StateLgas.length; index++) 
        {
            await Lga.updateOne({ _id: StateLgas[index]?._id }, { $set: { deletedAt: new Date() } })
        }

        const StateLga = await Lga.find({ state: state })
        for (let index = 0; index < StateLga.length; index++) 
        {
            await Lga.updateOne({ state: state }, { $set: { deletedAt: new Date() } })
        }

        await State.updateOne({ _id: state }, { $set: { deletedAt: new Date() } })
        return RemoveState?.name
    }


    public async restore(state: string): Promise<Error | string | any>
    {
        const RestoreState = await State.findOne({ _id: state })
        if(!RestoreState)
        {
          responseFormat('Invalid request passed', 400, null)
        }

        const StateLgas = RestoreState?.lgas
        for (let index = 0; index < StateLgas.length; index++) 
        {
            await Lga.updateOne({ _id: StateLgas[index]?._id }, { $set: { deletedAt: null } })
        }

        const StateLga = await Lga.find({ state: state })
        for (let index = 0; index < StateLga.length; index++) 
        {
            await Lga.updateOne({ state: state }, { $set: { deletedAt: null } })
        }

        await State.updateOne({ _id: state }, { $set: { deletedAt: null } })
        return RestoreState?.name
    }


    public async delete(state: string): Promise<Error | string | any>
    {
        const DeleteState = await State.findOne({ _id: state })
        if(!DeleteState)
        {
          responseFormat('Invalid request passed', 400, null)
        }

        const StateLgas = DeleteState?.lgas
        for (let index = 0; index < StateLgas.length; index++) 
        {
            await Lga.deleteOne({ state: state })
        }

        await State.deleteOne({ _id: state })
        return DeleteState?.name
    }
      
    

}

export default StateService;