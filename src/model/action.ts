import mongoose from 'mongoose';
mongoose.Promise  =   global.Promise;
const Action        =   mongoose.Schema;

 
const actionSchema = new Action(
    { 
        name:           {   type : String, maxlength : 130, unique : true, required : [true, 'action name is required'] },
        description:    {   type : String, maxlength : 100, required : [true, 'provide description for action'] }
    },
    { timestamps : true }
);

actionSchema.statics.findActionById = function(id: number)
{
    // do something;
    return this.where('_id').equals(id).count();
    // next();
};

actionSchema.statics.countActions = function()
{
    // do something;
    return this.find({}).count();
    // next();
};

actionSchema.statics.doesActionExist = function(actionId: number)
{
    // do something;
    return this.where('_id').equals(actionId).count();
    // next();
};

actionSchema.statics.checkIfActionExist = function(actionName: string)
{
    // do something;
    return this.where('name').equals(actionName).count();
    // next();
};

actionSchema.statics.allAction = async function()
{
    return await this.find({});
    // next();
};

module.exports = mongoose.model('Action', actionSchema); 