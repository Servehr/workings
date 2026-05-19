import mongoose, { model, Schema }   from 'mongoose'

 
const PrivilegeSchema = new Schema(
    { 
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default : null },
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default : null }
    },
    { timestamps : true }
);

PrivilegeSchema.statics.doesRoleExist = function(privilege: number)
{
    // do something;
    return this.where('_id').equals(privilege).count();
    // next();
};

export default model<any>('Privilege', PrivilegeSchema)