import { model, Schema }   from 'mongoose'

 
const RoleSchema = new Schema(
    { 
        name:           {   type : String, maxlength : 130, unique : true, required : [true, 'role name is required'] },
        description:    {   type : String, maxlength : 100, required : [true, 'provide role description'] }
    },
    { timestamps : true }
);

RoleSchema.statics.findRoleById = function(id: number)
{
    // do something;
    return this.where('_id').equals(id).count();
    // next();
};

RoleSchema.statics.countRoles = function()
{
    // do something;
    return this.find({}).count();
    // next();
};

RoleSchema.statics.doesRoleExist = function(roleId: number)
{
    // do something;
    return this.where('_id').equals(roleId).count();
    // next();
};

RoleSchema.statics.checkIfRoleExist = function(roleName: string)
{
    // do something;
    return this.where('name').equals(roleName).count();
    // next();
};

RoleSchema.statics.allRoles = async function()
{
    return await this.find({});
    // next();
};

export default model<any>('Role', RoleSchema)