import mongoose, { Schema, model }   from 'mongoose';

 
const pageSchema = new Schema(
    { 
        name:           {  type : String, maxlength : 130, unique : true, required : [true, 'rexource name is required'] },
        description:    {  type : String, maxlength : 100, required : [true, 'provide description for rexource'] },
        aktions:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Aktion', default: null }],
        deletedAt:      {  type : Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('Page', pageSchema)