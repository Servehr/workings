import Company from "@/model/management/company";
import { paginate } from "@/utils/pagination";
import { responseFormat } from "@/utils/response-format";



class CompanyService {

  
    public async partners(page: number, limit: number): Promise<Error | String | any>
    { 
       const children = {      
         path: 'branches',
         match: { deletedAt: null },
         select: '_id name'
       }
       return await paginate(Company, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name url', children)    
           
    }

    public async create(name: string, url: string): Promise<Error | string | any>
    {
      await Company.create({ name, url })
      return name
    }

    public async update(company: string, name: string, url: string): Promise<Error | string | any>
    {
      const doesExist = await Company.findOne({ company })
      if(!doesExist)
      {
        responseFormat('Result find no match', 400, null)
      }
      const updateComapny = await Company.findOneAndUpdate({ _id: company }, { $set: { name: name, url: url } }) 
      return updateComapny?.name
    }    

    public async removeCompany(company: string): Promise<Error | string | any>
    {
      const CompanyToRemove = await Company.findOne({ _id: company })
      if(!CompanyToRemove)
      {
        responseFormat('Invalid request passed', 400, null)       
      }
      const removed = await Company.findOneAndUpdate({ _id: company }, { $set: { deletedAt: Date.now() } })
      return removed?.name + ' deleted'
    }

    public async restoreCompany(company: string): Promise<Error | string | any>
    {
      const CompanyToRemove = await Company.findOne({ _id: company })
      if(!CompanyToRemove)
      {
        responseFormat('Invalid request passed', 400, null)         
      }
      const updated =  await Company.findOneAndUpdate({ _id: company }, { $set: { deletedAt: null } })
      return updated?.name + ' restored'
    }

    public async deleteCompany(company: string): Promise<Error | string | any>
    {
      const DeleteCompany = await Company.findOne({ _id: company })
      if(!DeleteCompany)
      {
        responseFormat('Invalid request passed', 400, null)
      }
      const deleted =  await Company.findOneAndDelete({ _id: company })
      return DeleteCompany?.name + ' deleted'
    }
    

}

export default CompanyService;