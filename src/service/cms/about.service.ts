import About from "@/model/cms/about";


class AboutService {

    
    public async aboutus(): Promise<Error | String | any>
    {
        return await About.find({ name: 1 })
    }

    public async create(aboutus: string): Promise<Error | string | any>
    {
       return await About.create({ aboutus })
    }

    public async update(about: string, aboutus: string): Promise<Error | string | any>
    {
        const aboutToUpdate = await About.findOne({ _id: about })
        if(!aboutToUpdate)
        {
           let RESPONSE: { message: string, statusCode: number, data: any } = {
              message: 'Invalid request passed',
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE))         
        }
        await About.updateOne({ _id: about }, { $set: { aboutus: aboutus } }) 
        return aboutToUpdate?.name
    } 
    

}

export default AboutService;