import mongoose, { Schema, model }   from 'mongoose';


const PrivilegeSchema = new Schema(
    { 
        page:       { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null },
        aktions:    [ { type: mongoose.Schema.Types.ObjectId, ref: 'Aktion', default: null } ]
    }
);

export default model<any>('Privilege', PrivilegeSchema) 