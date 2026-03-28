import mongoose, { Schema }   from 'mongoose';
mongoose.Promise  =   global.Promise;
const Rexource        =   mongoose.Schema;

 
const rexourceSchema = new Rexource(
    { 
        name:           {   type : String, maxlength : 130, unique : true, required : [true, 'rexource name is required'] },
        description:    {   type : String, maxlength : 100, required : [true, 'provide description for rexource'] }
    },
    { timestamps : true }
);

rexourceSchema.statics.findRexourceById = function(id: number)
{
    // do something;
    return this.where('_id').equals(id).count();
    // next();
};

rexourceSchema.statics.countRexources = function()
{
    // do something;
    return this.find({}).count();
    // next();
};

rexourceSchema.statics.doesRexourceExist = function(rexourceId: number)
{
    // do something;
    return this.where('_id').equals(rexourceId).count();
    // next();
};

rexourceSchema.statics.checkIfRexourceExist = function(rexourceName: string)
{
    // do something;
    return this.where('name').equals(rexourceName).count();
    // next();
};

rexourceSchema.statics.allRexource = async function()
{
    return await this.find({});
    // next();
};

module.exports = mongoose.model('Rexource', rexourceSchema); 