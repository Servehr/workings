import About from "@/model/cms/about";
import { responseFormat } from "@/utils/response-format";


class AboutService {

    
    public async aboutus(): Promise<Error | String | any>
    {
        // return await About.find().select('title aboutus images');
        return await About.find(
                  { deletedAt: null },
                  { title: 1, aboutus: 1, images: 1 }
               )
    }

    public async create(title: string, aboutus: string, images: string[]): Promise<Error | string | any>
    {
       return await About.create({ title, aboutus })
    }

    public async update(about: string, title: string, aboutus: string, images: string[]): Promise<Error | string | any>
    {
        const aboutToUpdate = await About.findOne({ _id: about })
        if(!aboutToUpdate)
        {
           responseFormat('Invalid request passed', 400, null)        
        }
        await About.updateOne({ _id: about }, { $set: { title: title, aboutus: aboutus } }) 
        if(images.length > 0)
        {
           
        }
        return
    } 

    public async remove(about: string): Promise<Error | string | any>
    {
       const doesExist = await About.exists({ _id: about });
       if(doesExist)
       {
           // await About.findByIdAndDelete(about)
           await About.updateOne({ _id: about }, { $set: { deletedAt: Date.now() } }) 
           return
       } else {
           responseFormat('Data operation failed', 400, null)
       }
    }
    

}

export default AboutService;