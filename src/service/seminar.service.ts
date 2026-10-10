import Seminar from "@/model/seminar";
import { paginate } from "@/utils/pagination";
import { responseFormat } from "@/utils/response-format";


class SeminarService {

    public async seminars(page: number, limit: number): Promise<Error | String | any>
    {
       const fields: string = 'title logo location time date host about speakers facebook youtube tiktok instagram twitch x'
       return await paginate(Seminar, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, fields, null)    
    }

    public async create(seminars: any): Promise<Error | string | any>
    {
       return await Seminar.create({ seminars })
    }

    public async update(seminar: string, event: any): Promise<Error | string | any>
    {
      const seminarToUpdate = await Seminar.findOne({ _id: seminar })
      if(!seminarToUpdate)
      {
        responseFormat('Invalid request passed', 400, null)         
      }
      await Seminar.updateOne({ _id: seminar }, { $set: 
                                                         { 
                                                            title: event.title, logo: event.logo, location: event.location, time: event.time, date: event.date, host: event.host, about: event.about, 
                                                            facebook: event.facebook, youtube: event.youtube, tiktok: event.tiktok, instagram: event.instagram, twitch: event.twitch, x: event.x
                                                         } 
                                                }
                                             ) 
      return 'Event Updated'
    } 

    public async updateHightlight(plan: string, highlight: string)
    {
       const hightlightToUpdate = await Seminar.findOne({ _id: plan })
       if(!hightlightToUpdate)
       {
         responseFormat('Invalid request passed', 400, null)         
       }

       let hightlightPosition: number = -1
       let highlightStatus: string  = ''
       let highlightContent: string = ''
       let highlightLine: string = ''

       for (let index = 0; index < hightlightToUpdate.length; index++) 
       {
         if(hightlightToUpdate[index]?.line === highlight)
         {
            hightlightPosition = index
            highlightStatus = hightlightToUpdate[index]?.status
            highlightContent = hightlightToUpdate[index]?.content
         }         
       }   
       const toUpdate = `hightlightToUpdate.${hightlightPosition}`

       const toUpdateHighlight = { status: highlightStatus, content: highlightContent, line: highlightLine }
       await hightlightToUpdate.findOneAndUpdate({ _id: plan }, { $set: { [toUpdate]: toUpdateHighlight } } )      
    }

    public async removeHighlight(plan: string, highlight: string)
    {
       const hightlightToUpdate = await Seminar.findOne({ _id: plan })
       if(!hightlightToUpdate)
       {
         responseFormat('Invalid request passed', 400, null)         
       }

       let hightlightPosition: number = -1
       let highlightContent: string = ''
       let highlightLine: string = ''

       for (let index = 0; index < hightlightToUpdate.length; index++) 
       {
         if(hightlightToUpdate[index]?.line === highlight)
         {
            hightlightPosition = index
            highlightContent = hightlightToUpdate[index]?.content
         }         
       }   
       const toUpdate = `hightlightToUpdate.${hightlightPosition}`

       const toUpdateHighlight = { status: false, content: highlightContent, line: highlightLine }
       await hightlightToUpdate.findOneAndUpdate({ _id: plan }, { $set: { [toUpdate]: toUpdateHighlight } } ) 
        
    }

    public async restoreHighlight(plan: string, highlight: string)
    {
       const hightlightToUpdate = await Seminar.findOne({ _id: plan })
       if(!hightlightToUpdate)
       {
         responseFormat('Invalid request passed', 400, null)         
       }

       let hightlightPosition: number = -1
       let highlightContent: string = ''
       let highlightLine: string = ''

       for (let index = 0; index < hightlightToUpdate.length; index++) 
       {
         if(hightlightToUpdate[index]?.line === highlight)
         {
            hightlightPosition = index
            highlightContent = hightlightToUpdate[index]?.content
         }         
       }   
       const toUpdate = `hightlightToUpdate.${hightlightPosition}`

       const toUpdateHighlight = { status: true, content: highlightContent, line: highlightLine }
       await hightlightToUpdate.findOneAndUpdate({ _id: plan }, { $set: { [toUpdate]: toUpdateHighlight } } )         
    }

    public async deleteHighlight(plan: string, highlight: string)
    {
       const hightlightToUpdate = await Seminar.findOne({ _id: plan })
       if(!hightlightToUpdate)
       {
         responseFormat('Invalid request passed', 400, null)         
       }

       for (let index = 0; index < hightlightToUpdate.length; index++) 
       {
         if(hightlightToUpdate[index]?.line === highlight)
         {
            // splice here
         }         
       }   
       return 
        
    }
    

}

export default SeminarService;