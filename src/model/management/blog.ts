import mongoose, { Schema, model }   from 'mongoose';

 
const BlogSchema = new Schema(
    { 
        user:           {  type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        title:          {  type : String, maxlength : 130, unique : true, required : [true, 'post name is required'] },
        content:        {  type : String, maxlength : 100, required : [true, 'provide content'] },
        comments:       [  { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null } ],
        likes:          {  type : Number, default : 0 },
        status:         {  type : String, enum: ['open', 'close'], default : "open", lowercase  : true },
        images:         [  
                          { status: { type: String, default: false } },
                          { faceImage: { type: Boolean, default: false } },
                          { image: { type: String, default: null } },
                        ],
        deletedAt:      {  type : Date, default : null  },
    },
    { timestamps : true }
);

BlogSchema.statics.findBlogById = function(id: number)
{
    // do something;
    return this.where('_id').equals(id).count();
    // next();
};

BlogSchema.statics.countBlogs = function()
{
    // do something;
    return this.find({}).count();
    // next();
};

BlogSchema.statics.doesBlogExist = function(blogId: number)
{
    // do something;
    return this.where('_id').equals(blogId).count();
    // next();
};

BlogSchema.statics.checkIfBlogExist = function(blogName: string)
{
    // do something;
    return this.where('name').equals(blogName).count();
    // next();
};

BlogSchema.statics.allBlog = async function()
{
    return await this.find({});
    // next();
};

export default model<any>('Blog', BlogSchema)