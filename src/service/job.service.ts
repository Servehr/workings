import { random } from "@/helper/random";
import Job from "@/model/job";
import User from "@/model/user";



class JobService {

    
    public async jobs(): Promise<Error | String | any>
    {
       return await Job.find(
          { 
            deletedAt: null   
          },
       ).populate({
            path: 'user',
            match: { deletedAt: null },
            select: '_id firstname surname phone email userType profilePicture role'
       }).populate({
            path: 'category',
            match: { deletedAt: null },
            select: '_id name'
       }).populate({
            path: 'divisions',
            match: { deletedAt: null },
            select: '_id name'
       })       
    }

    public async jobStatus(status: string)
    {
        return await Job.find(
          { 
            status: status,
            deletedAt: null   
          },
       ).populate({
            path: 'user',
            match: { deletedAt: null },
            select: '_id firstname surname phone email userType profilePicture role'
       }).populate({
            path: 'category',
            match: { deletedAt: null },
            select: '_id name'
       }).populate({
            path: 'divisions',
            match: { deletedAt: null },
            select: '_id name'
       })
    }

    public async cancelJob(status: string, job: string): Promise<Error | string | any>
    {
      const JobToCancel = await Job.findOne({ _id: job })
      if(!JobToCancel)
      {
         let RESPONSE: { message: string, statusCode: number, data: any } = {
           message: 'Invalid request passed',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))         
      }
      await Job.updateOne({ _id: job }, { $set: { status: status } })
      const JobCancelled = await User.findOne({ _id: JobToCancel?.user })
      return `${JobCancelled?.firstname} ${JobCancelled?.surname} canceled job with Tag ID ${JobToCancel?.tag}`
      
    }

    public async create(job: any): Promise<Error | string | any>
    {
      const user = await User.findOne({ _id: job?.user })
      if(!user)
      {
        let RESPONSE: { message: string, statusCode: number, data: any } = {
          message: 'Invalid request passed a',
          statusCode: 404,
          data: null
        }
        throw new Error(JSON.stringify(RESPONSE))         
      }
      job.tag = random.character(15)
      await Job.create(job)
      let message: string = `${user?.firstname} ${user?.surname} posted a job`
      return message
    }

    public async removeJob(job: string): Promise<Error | string | any>
    {
      const JobToRemove = await Job.findOne({ _id: job })
      if(!JobToRemove)
      {
        let RESPONSE: { message: string, statusCode: number, data: any } = {
          message: 'Invalid request passed',
          statusCode: 404,
          data: null
        }
        throw new Error(JSON.stringify(RESPONSE))         
      }
      return await Job.updateOne({ _id: job }, { $set: { deletedAt: Date.now() } })
    }

    public async restoreJob(job: string): Promise<Error | string | any>
    {
      const JobToRemove = await Job.findOne({ _id: job })
      if(!JobToRemove)
      {
        let RESPONSE: { message: string, statusCode: number, data: any } = {
          message: 'Invalid request passed',
          statusCode: 404,
          data: null
        }
        throw new Error(JSON.stringify(RESPONSE))         
      }
      return await Job.updateOne({ _id: job }, { $set: { deletedAt: null } })
    }

    public async deleteJob(job: string): Promise<Error | string | any>
    {
      const DeleteJob = await Job.findOne({ _id: job })
      if(!DeleteJob)
      {
         let RESPONSE: { message: string, statusCode: number, data: any } = 
         {
           message: 'Invalid request passed',
           statusCode: 404,
           data: null
         }
         throw new Error(JSON.stringify(RESPONSE))
      }
      return await Job.deleteOne({ _id: job })
    }
    

}

export default JobService;