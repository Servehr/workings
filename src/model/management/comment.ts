import mongoose, { Schema, model }   from 'mongoose';

 
const CommentSchema = new Schema(
    { 
        user:           {  type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        post:           {  type: mongoose.Schema.Types.ObjectId, ref: 'Blog', default: null },
        comment:        {  type : String, maxlength : 500, required : [true, 'comment field is required'] },
        status:         {  type : String, enum: ['pending', 'disable', 'active'], default : "active", lowercase  : true },
        deletedAt:      {  type : Date, default : null  },
    },
    { timestamps : true }
);

CommentSchema.statics.findCommentById = function(id: number)
{
    // do something;
    return this.where('_id').equals(id).count();
    // next();
};

CommentSchema.statics.countComments = function()
{
    // do something;
    return this.find({}).count();
    // next();
};

CommentSchema.statics.doesCommentExist = function(commentId: number)
{
    // do something;
    return this.where('_id').equals(commentId).count();
    // next();
};

CommentSchema.statics.checkIfCommentExist = function(commentName: string)
{
    // do something;
    return this.where('name').equals(commentName).count();
    // next();
};

CommentSchema.statics.allComment = async function()
{
    return await this.find({});
    // next();
};

export default model<any>('Comment', CommentSchema)