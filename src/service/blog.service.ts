import { paginate } from "@/utils/pagination";
import Blog from "@/model/management/blog";
import { responseFormat } from "@/utils/response-format";
import { uploadImages } from "@/utils/uploadImages";
import { uploadImage } from "@/utils/uploadImage";


class BlogService {

    
    public async blogs(page: number, limit: number): Promise<Error | String | any>
    {
      const children = 
      {    
         match: { deletedAt: null },
         populate: [
            { path: 'blogImages', select: '_id faceImage, visible' },
            { path: 'comments', select: '_id name description', populate: { path: 'Users', select: '_id firstname surname' } }
         ]
      }
      return await paginate(Blog, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name highlight content', children)    
    }


    public async blogPost(post: string): Promise<Error | string | any>
    {
       return await Blog.findOne({ _id: post }, '_id title content comments likes images').populate(
         [
            {
               path: 'user',
               model: 'User',
               select: '_id firstname surname'
            },
            // {
            //    path: 'comment',
            //    model: 'Comment',
            //    select: '_id comment',
            //    populate: { path: 'User', select: '_id firstname surname' }
            // }
         ]
       ).lean()
    }


    public async create(title: string, content: string, images: { image: string, folder: string }[]): Promise<Error | string | any>
    {
      const user: string = ''
      let imgs: string[] = []
      await uploadImages(images)
      .then((results) => 
      {
         const secureUrls: any = results.map(result => result.secure_url)
         imgs.push(secureUrls)
      })

      if(imgs.length === 0)
      {
         responseFormat('Uplading image to server failed', 400, null)
      }
      await Blog.create({ user, title, content, images: imgs })
      return title
    }

    public async updateBlogImage(post: string, image: string): Promise<Error | string | any>
    {
       let secureUrl: string = ''
       await uploadImage(image)
       .then((result) => 
       {
          secureUrl = result.secure_url
       })

       if(!secureUrl)
       {
         responseFormat('Uplading image to server failed', 400, null)
       }

       const blogPost = await Blog.findById({ _id: post })
       const blogPostImages = blogPost.images

       //  blogPostImages.map((image) => image?.type )
       // remove image/images from cloudinary

       let imagePosition: number  = -1  
       let imageFaceImage: boolean = false
       let imageStatus: boolean = false

       for (let index = 0; index < blogPostImages.length; index++) 
       {
         if(blogPostImages[index]?.image === image)
         {
            imagePosition = index
            imageStatus = blogPostImages[index]?.status
            imageFaceImage = blogPostImages[index]?.faceImage
         }         
       }   
       const toUpdate = `images.${imagePosition}`

       const toUpdateBlogImage = { status: imageStatus, faceImage: imageFaceImage, image: secureUrl }
       await Blog.findOneAndUpdate({ _id: post }, { $set: { [toUpdate]: toUpdateBlogImage } } )

    }


    public async update(post: string, title: string, content: string): Promise<Error | string | any>
    {
       const postToUpdate = await Blog.findOne({ _id: post })
       if(!postToUpdate)
       {
         responseFormat('Invalid request passed', 400, null)         
       }
       await Blog.updateOne({ _id: post }, { $set: { name: title, description: content } })
       return postToUpdate?.name
    }

    public async remove(post: string): Promise<Error | string | any>
    {
       const RemoveBlogPost = await Blog.findOne({ _id: post })
       if(!RemoveBlogPost)
       {
          responseFormat('Invalid request passed', 400, null) 
        }
        await Blog.updateOne({ _id: post }, { $set: { deletedAt: new Date() } })
        return RemoveBlogPost?.name
    }


    public async restore(post: string): Promise<Error | string | any>
    {
        const removeBlogPost = await Blog.findOne({ _id: post })
        if(!removeBlogPost)
        {
           responseFormat('Invalid request passed', 400, null) 
        }
        await Blog.updateOne({ _id: post }, { $set: { deletedAt: null } })
        return removeBlogPost?.name
    }


    public async delete(post: string): Promise<Error | string | any>
    {
        const deleteBlogPost = await Blog.findOne({ _id: post })
        if(!deleteBlogPost)
        {
           responseFormat('Invalid request passed', 400, null) 
        }
        await Blog.deleteOne({ _id: post })
        return deleteBlogPost?.name
    }    
    

}

export default BlogService;