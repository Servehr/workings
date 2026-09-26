import mongoose, { Schema, model }   from 'mongoose';

 
const AuthoritySchema = new Schema(
    { 
        role:       { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
        rexource:   { type: mongoose.Schema.Types.ObjectId, ref: 'Rexource', default: null },
        page:       { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null },
        deletedAt:  { type : Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('Authority', AuthoritySchema) 