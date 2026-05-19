import Country from "@/model/management/country";
import State from "@/model/management/state";
import Lga from "@/model/management/lga";
import { paginate } from "@/utils/pagination";


class CountryService {

    
    public async countries(): Promise<Error | String | any>
    {
        // return await Country.find(
        //   {  
        //     $or: [
        //       { "newField": true },
        //       { "newField": { "$exists": false } }
        //     ], 
        //     deletedAt: null   
        //   },
        //   { name: 1 }
        // ).populate({
        //     path: 'states',
        //     match: { deletedAt: null },
        //     select: '_id name',
        //     populate: {
        //        match: { deletedAt: null },
        //        path: 'lgas',
        //        model: 'Lga',
        //        select: '_id name',
        //     }
        // }) 

        const children = {      
            path: 'states',
            match: { deletedAt: null },
            select: '_id name',
            populate: {
               match: { deletedAt: null },
               path: 'lgas',
               model: 'Lga',
               select: '_id name',
            }
        }
        return await paginate(Country, { deletedAt: null }, { page: 1, limit: 5, sort: { _id: 1 } }, '_id name states', children)    
        

    }


    public async create(name: string): Promise<Error | string | any>
    {
       await Country.create({ name })
       return name
    }


    public async update(country: string, name: string): Promise<Error | string | any>
    {
        const CountryToUpdate = await Country.findOne({ _id: country })
        if(!CountryToUpdate)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))         
        }
        await Country.updateOne({ _id: country }, { $set: { name: name } }) 
        return CountryToUpdate?.name
    }


    public async remove(country: string): Promise<Error | string | any>
    {
        const RemoveCountry = await Country.findOne({ _id: country })
        if(!RemoveCountry)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        const CountryStates = RemoveCountry?.states
        for (let index = 0; index < CountryStates.length; index++) 
        {
            await State.updateOne({ _id: CountryStates[index]?._id }, { $set: { deletedAt: new Date() } })
        }

        const CountryStateLga = await Lga.find({ country: country })
        for (let index = 0; index < CountryStateLga.length; index++) 
        {
            await Lga.updateOne({ country: country }, { $set: { deletedAt: new Date() } })
        }

        await Country.updateOne({ _id: country }, { $set: { deletedAt: new Date() } })
        return RemoveCountry?.name
    }


    public async restore(country: string): Promise<Error | string | any>
    {
        const RestoreCountry = await Country.findOne({ _id: country })
        if(!RestoreCountry)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }        
        const CountryStates = RestoreCountry?.states
        for (let index = 0; index < CountryStates.length; index++) 
        {
            await State.updateOne({ _id: CountryStates[index]?._id }, { $set: { deletedAt: null } })
        }

        const CountryStateLga = await Lga.find({ country: country })
        for (let index = 0; index < CountryStateLga.length; index++) 
        {
            await Lga.updateOne({ country: country }, { $set: { deletedAt: null } })
        }

        await Country.updateOne({ _id: country }, { $set: { deletedAt: null } })
        return RestoreCountry?.name
    }


    public async delete(country: string): Promise<Error | string | any>
    {
        const DeleteCountry = await Country.findOne({ _id: country })
        if(!DeleteCountry)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = 
           {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))
        }
        const CountryStates = DeleteCountry?.states
        for (let index = 0; index < CountryStates.length; index++) 
        {
            await State.deleteOne({ _id: CountryStates[index]?._id })
        }

        const CountryStateLga = await Lga.find({ country: country })
        for (let index = 0; index < CountryStateLga.length; index++) 
        {
            await Lga.deleteOne({ country: country })
        }

        await Country.deleteOne({ _id: country })
        return DeleteCountry?.name
    }
      
    

}

export default CountryService;