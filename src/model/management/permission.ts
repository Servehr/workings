import mongoose, { Schema, model }   from 'mongoose';


const priviledge = new Schema(
    { 
        page:       { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null },
        aktions:    [ { type: mongoose.Schema.Types.ObjectId, ref: 'Aktion', default: null } ],
    }
);

 
const PermissionSchema = new Schema(
    { 
        role:       { type: mongoose.Schema.Types.ObjectId, ref: 'Role', unique: true, default: null },
        rexource:   { type: mongoose.Schema.Types.ObjectId, ref: 'Rexource', default: null },
        priviledge: [ priviledge ],
        deletedAt:  { type : Date, default : null  },
    },
    { timestamps : true }
);



export default model<any>('Permission', PermissionSchema) 