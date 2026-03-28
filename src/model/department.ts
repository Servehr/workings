import { model, Schema } from 'mongoose';

 
const DepartmentSchema = new Schema(
    { 
        name:           {   type : String, maxlength : 130, unique : true, required : [true, 'department name is required'] },
        description:    {   type : String, maxlength : 100, required : [true, 'provide description for department '] }
    },
    { timestamps : true }
);

DepartmentSchema.statics.findDepartmentById = function(id: number)
{
    // do something;
    return this.where('_id').equals(id).count();
    // next();
};

DepartmentSchema.statics.countDepartment = function()
{
    // do something;
    return this.find({}).count();
    // next();
};

DepartmentSchema.statics.doesDepartmentExist = function(DepartmentId: number)
{
    // do something;
    return this.where('_id').equals(DepartmentId).count();
    // next();
};

DepartmentSchema.statics.checkIfDepartmentExist = function(departmentName: string)
{
    // do something;
    return this.where('name').equals(departmentName).count();
    // next();
};

DepartmentSchema.statics.allDepartment = async function()
{
    return await this.find({});
    // next();
};


export default model<any>('Department', DepartmentSchema)