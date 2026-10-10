import Plan from "@/model/plan";
import { responseFormat } from "@/utils/response-format";


class PlanService {

    
    public async plans(): Promise<Error | String | any>
    {
       return await Plan.find({ })
    }

    public async create(plan: string, price: Number, highlights: string[]): Promise<Error | string | any>
    {
       return await Plan.create({ plan, price, highlights })
    }

    public async update(plann: string, plan: string, price: string): Promise<Error | string | any>
    {
       const aboutToUpdate = await Plan.findOne({ _id: plann })
       if(!aboutToUpdate)
       {
         responseFormat('Invalid request passed', 400, null)         
       }
       await Plan.updateOne({ _id: plann }, { $set: { plan: plan, price: price } }) 
       return aboutToUpdate?.name
    } 

    public async updateHightlight(plan: string, highlight: string)
    {
       const hightlightToUpdate = await Plan.findOne({ _id: plan })
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
       const hightlightToUpdate = await Plan.findOne({ _id: plan })
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
       const hightlightToUpdate = await Plan.findOne({ _id: plan })
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
       const hightlightToUpdate = await Plan.findOne({ _id: plan })
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

export default PlanService;