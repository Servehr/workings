import Page from "@/model/management/page";
import Rexource from "@/model/management/rexource";
import { paginate, PaginationOptions } from "@/utils/pagenation";
import { responseFormat } from "@/utils/response-format";
// import { paginate } from "@/utils/pagination";
import mongoose from "mongoose";


class PageService {

    
    public async pages(page: number, limit: number): Promise<Error | String | any>
    {
      // const children = {      
      //    path: 'aktions',
      //    match: { deletedAt: null },
      //    select: '_id name description'
      // }  
      // const parent = {      
      //    path: 'aktions',
      //    match: { deletedAt: null },
      //    select: '_id name description'
      // }      
      // return await paginate(Page, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name rexource description', children)    

      const options: PaginationOptions = 
      {
         currentPage: page || 1,
         limit: limit || 10,
         sort: { _id: -1 },
         // Define multiple and nested populate configurations cleanly
         populate: [
            { path: 'aktions', select: '_id name description' }, 
            { path: 'rexource', select: '_id name rexource description'}
         ]
      };

      // Execute the paginated query
      return await paginate<any>(Page, { deletedAt: null }, options);  
    }

    public async pageActions(page: string): Promise<Error | String | any>
    {
       return await Page.findOne({ _id: page }).populate([ {  path: 'aktions' }])
    }    

    public async create(name: string, description: string): Promise<Error | string | any>
    {
       const page = await Page.create({ name, description })
       return page.name
    }

    public async update(page: string, name: string, description: string): Promise<Error | string | any>
    {
        const pageToUpdate = await Page.findOne({ _id: page })
        if(!pageToUpdate)
        {
           responseFormat('Invalid request passed', 400, null)         
        }
        await Page.updateOne({ _id: page }, { $set: { name: name, description: description } }) 
        return pageToUpdate?.name
    }

    public async remove(page: string): Promise<Error | string | any>
    {
        const RemovePage = await Page.findOne({ _id: page })
        if(!RemovePage)
        {
           responseFormat('Invalid request passed', 400, null)
        }
        await Page.updateOne({ _id: page }, { $set: { deletedAt: new Date() } })
        return RemovePage?.name
    }

    public async restore(page: string): Promise<Error | string | any>
    {
        const RestorePage = await Page.findOne({ _id: page })
        if(!RestorePage)
        {
           responseFormat('Invalid request passed', 400, null)
        }
        await Page.updateOne({ _id: page }, { $set: { deletedAt: null } })
        return RestorePage?.name
    }

    public async delete(rexource: string, page: string): Promise<Error | string | any>
    {
      const theRexource = Rexource.findOne({ _id: rexource })
      if(!theRexource)
      {
         responseFormat('Invalid request passed', 400, null) 
      }
      
      const DeletePage = await Page.findOne({ _id: page })
      if(!DeletePage)
      {
         responseFormat('Invalid request passed', 400, null)
      }
      
      await Rexource.findByIdAndUpdate(rexource, 
        { $pull: { pages: page } }, 
        { new: true }
      )  
      await Page.deleteOne({ _id: page })
      return DeletePage?.name
    }

    public async rexourcePages(rexource: string): Promise<Error | string[] | any> 
    {
       const DoesRexourceExsit = await Rexource.findOne({ _id: rexource })
       if(!DoesRexourceExsit) 
       {
         responseFormat('Invalid request passed', 400, null)
       }      
       const rexources = await Rexource.findOne({ _id: rexource }, { '_id': 0, 'department': 0, 'deletedAt': 0, 'name': 0, 'description': 0, 'createdAt': 0, 'updatedAt': 0, '__v': 0 })
                           .populate([ {  path: 'pages',  select: 'pages' }])
       return rexources       
    }

    public async connectPageToRexource(rexource: string, pages: string[]): Promise<Error | string | any>
    {
       let InvalidPage: string[] = []
       let ValidPage: string[] = []
       let Pages = await Page.find({}, '_id')

       let PagesId: string[] = []
       for (let index = 0; index < Pages.length; index++) 
       {
          PagesId.push(Pages[index]?._id?.toString())        
       }

       for (let index = 0; index < pages.length; index++) 
       {
         if(!PagesId.includes(pages[index]))
         {
            InvalidPage.push(pages[index])
         } else {
            ValidPage.push(pages[index])
         }
       }
       
       if(InvalidPage?.length > 0)
       {
         responseFormat('Invalid request passed', 400, null) 
       }

       let connectedPages = await this.rexourcePages(rexource)
       
       let Invalid: string[] = []
       let Valid: string[] = []

       let ConnectedPageId: string[] = []
       if(connectedPages?.pages?.length > 0)
       {
         for (let index = 0; index < connectedPages?.pages?.length; index++) 
         {
            ConnectedPageId.push(connectedPages?.pages[index]?._id?.toString())        
         }
         
         for (let index = 0; index < pages.length; index++) 
         {
            if(ConnectedPageId?.includes(pages[index]))
            {
              Invalid.push(pages[index])
            } else {
              Valid.push(pages[index])
            }
         }

         let InvalidPageName: string[] = []
         for (let index = 0; index < Invalid.length; index++) 
         {
            const pName = await Page.findOne({ _id: Invalid[index] })
            InvalidPageName.push(pName?.name)
         }
         console.log(Valid)
         if(Valid?.length === 0)
         {
            responseFormat(`${InvalidPageName.join(", ")} already connected or invalid`, 400, null)
         }

         let ValidPagesName: string[] = []
         for (let index = 0; index < Valid.length; index++) 
         {
            const pName = await Page.findOne({ _id: Valid[index] })
            ValidPagesName.push(pName?.name)
         }

         let TheValidPagesName = ValidPagesName?.join(", ")
         await Rexource.findByIdAndUpdate(rexource, 
            { $push: { pages: Valid } }, 
            { new: true }
         )

         for (let index = 0; index < Valid.length; index++) 
         {
            await Page.updateOne({ _id: Valid[index] }, { $set: { rexource: rexource } }) 
         }

         const RexourceName = await Rexource.findById(rexource)
         const rName: string = RexourceName?.name
         let message = `${TheValidPagesName} attached to ${rName}`
         if(Invalid?.length > 0)
         {
            message += `AND ${InvalidPageName.join(", ")} already connected or invalid`
         }
         return message
       } else {
         
           let ConnectPageName: string[] = []
           for (let index = 0; index < ValidPage.length; index++) 
           {
              const pg = await Page.findOne({ _id: ValidPage[index] })
              ConnectPageName.push(pg?.name)               
           }
           await Rexource.findByIdAndUpdate(rexource, 
             { $push: { pages: ValidPage } }, 
             { new: true }
           )

           await Page.updateOne({ _id: pages[0] }, { $set: { rexource: rexource } }) 
           
          const RexourceName = await Rexource.findById(rexource)
          const rName: string = RexourceName?.name
          let message = `${ConnectPageName} attached to ${rName}`
          return message
       }      
    }

    public async disconnectPageFromRexource(rexource: string, pages: string[]): Promise<Error | string | any>
    {
       let InvalidPage: string[] = []
       let ValidPage: string[] = []
       let Pages = await Page.find({}, '_id')

       let PagesId: string[] = []
       for (let index = 0; index < Pages.length; index++) 
       {
          PagesId.push(Pages[index]?._id?.toString())        
       }

       for (let index = 0; index < pages.length; index++) 
       {
         if(! PagesId.includes(pages[index]))
         {
            InvalidPage.push(pages[index])
         } else {
            ValidPage.push(pages[index])
         }
       }

       if(InvalidPage?.length > 0)
       {
         responseFormat('Invalid request passed', 400, null) 
       }

       let connectedPages = await this.rexourcePages(rexource)

       if(connectedPages?.pages?.length === 0)
       {
         responseFormat('Invalid request passed', 400, null)  
       }
       
       let Invalid: string[] = []
       let Valid: string[] = []

       let ConnectedPageId: string[] = []
       
       for (let index = 0; index < connectedPages?.pages?.length; index++) 
       {
          ConnectedPageId.push(connectedPages?.pages[index]?._id?.toString())        
       }
         
       for (let index = 0; index < pages.length; index++) 
       {
         if(!ConnectedPageId?.includes(pages[index]))
         {
           Invalid.push(pages[index])
         } else {
           Valid.push(pages[index])
         }
       }

       let InvalidPageName: string[] = []
       for (let index = 0; index < Invalid.length; index++) 
       {
          const pName = await Page.findOne({ _id: Invalid[index] })
          InvalidPageName.push(pName?.name)
       }

       let ValidPagesName: string[] = []
       for (let index = 0; index < Valid.length; index++) 
       {
          const pName = await Page.findOne({ _id: Valid[index] })
          ValidPagesName.push(pName?.name)
       }

       let TheValidPagesName = ValidPagesName?.join(", ")

       let ObjectId = []
       for (let index = 0; index < Valid.length; index++) 
       {
         const id = new mongoose.Types.ObjectId(Valid[index])
         ObjectId.push(id)         
       }
       
       await Rexource.findByIdAndUpdate(rexource, 
         { $pullAll: { pages: Valid } }, 
         { new: true }
       )

       await Page.updateOne({ _id: pages[0] }, { $set: { rexource: null } }) 
         
       const RexourceName = await Rexource.findById(rexource)
       const rName: string = RexourceName?.name
       let message = `${TheValidPagesName} detached from ${rName}`
       if(Invalid?.length > 0)
       {
          message += `AND ${InvalidPageName.join(", ")} already disconnected or invalid`
       }
       return message
    }    
    


}

export default PageService;