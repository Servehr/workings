import Faq from "@/model/management/faq";
import { paginate } from "@/utils/pagination";
import { responseFormat } from "@/utils/response-format";



class FaqService {

  
    public async faqs(page: number, limit: number): Promise<Error | String | any>
    { 
       return await paginate(Faq, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name url', null)               
    }

    public async create(title: string, content: string): Promise<Error | string | any>
    {
      await Faq.create({ title, content })
      return title
    }

    public async update(faq: string, title: string, content: string): Promise<Error | string | any>
    {
      const doesExist = await Faq.findOne({ faq })
      if(!doesExist)
      {
        responseFormat('Result find no match', 400, null)
      }
      const updateFaq = await Faq.findOneAndUpdate({ _id: faq }, { $set: { title: title, content: content } }) 
      return updateFaq?.name
    }    

    public async removeFaq(faq: string): Promise<Error | string | any>
    {
      const faqToRemove = await Faq.findOne({ _id: faq })
      if(!faqToRemove)
      {
        responseFormat('Invalid request passed', 400, null)       
      }
      const removedFaq = await Faq.findOneAndUpdate({ _id: faq }, { $set: { deletedAt: Date.now() } })
      return removedFaq?.name + ' deleted'
    }

    public async restoreFaq(faq: string): Promise<Error | string | any>
    {
      const faqToRemove = await Faq.findOne({ _id: faq })
      if(!faqToRemove)
      {
        responseFormat('Invalid request passed', 400, null)         
      }
      const restored =  await Faq.findOneAndUpdate({ _id: faq }, { $set: { deletedAt: null } })
      return restored?.name + ' restored'
    }

    public async deleteFaq(faq: string): Promise<Error | string | any>
    {
      const DeleteFaq = await Faq.findOne({ _id: faq })
      if(!DeleteFaq)
      {
        responseFormat('Invalid request passed', 400, null)
      }
      await Faq.findOneAndDelete({ _id: DeleteFaq?._id })
      return DeleteFaq?.name + ' deleted'
    }
    

}

export default FaqService;