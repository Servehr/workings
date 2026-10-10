import { paginate } from "@/utils/pagination";
import Comment from "@/model/management/comment";
import { responseFormat } from "@/utils/response-format";


class CommentService {

    
    public async comments(page: number, limit: number): Promise<Error | String | any>
    {
      const children = 
      {    
         match: { deletedAt: null },
         populate: [
            { path: 'Users', select: '_id firstname, surname' },
         ]
      }
      return await paginate(Comment, { deletedAt: null }, { page: page, limit: limit, sort: { _id: -1 } }, '_id name highlight content', children)    
    }


    public async create(user: string, post: string, comment: string): Promise<Error | string | any>
    {
      await Comment.create({ user, post, comment })
      return ''
    }


    public async update(commentId: string, comment: string): Promise<Error | string | any>
    {
       const commentToUpdate = await Comment.findOne({ _id: commentId })
       if(!commentToUpdate)
       {
         responseFormat('Invalid request passed', 400, null)           
       }
       await Comment.updateOne({ _id: commentId }, { $set: { comment: comment } }) 
       return commentToUpdate?.name
    }


    public async remove(comment: string): Promise<Error | string | any>
    {
       const RemoveBlogPostComment = await Comment.findOne({ _id: comment })
       if(!RemoveBlogPostComment)
       {
         responseFormat('Invalid request passed', 400, null)
       }
       await Comment.updateOne({ _id: comment }, { $set: { deletedAt: new Date() } })
       return RemoveBlogPostComment?.name
    }


    public async restore(post: string): Promise<Error | string | any>
    {
        const restoreBlogPostComment = await Comment.findOne({ _id: post })
        if(!restoreBlogPostComment)
        {
          responseFormat('Invalid request passed', 400, null)
        }
        await Comment.updateOne({ _id: post }, { $set: { deletedAt: null } })
        return restoreBlogPostComment?.name
    }


    public async delete(comment: string): Promise<Error | string | any>
    {
      const deleteBlogPostComment = await Comment.findOne({ _id: comment })
      if(!deleteBlogPostComment)
      {
         responseFormat('Invalid request passed', 400, null)
      }
      await Comment.deleteOne({ _id: comment })
      return deleteBlogPostComment?.name
    }    
    

}

export default CommentService;