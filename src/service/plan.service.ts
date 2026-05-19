import Plan from "@/model/plan";


class AboutService {

    
    public async plans(): Promise<Error | String | any>
    {
        return await Plan.find({ name: 1 })
    }

    public async create(plan: string, price: Number): Promise<Error | string | any>
    {
       return await Plan.create({ plan, price })
    }

    public async update(plann: string, plan: string, price: string): Promise<Error | string | any>
    {
        const aboutToUpdate = await Plan.findOne({ _id: plann })
        if(!aboutToUpdate)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))         
        }
        await Plan.updateOne({ _id: plann }, { $set: { plan: plan, price: price } }) 
        return aboutToUpdate?.name
    } 
    

}

export default AboutService;