import mongoose, { Schema, model }   from 'mongoose';

 
const pageSchema = new Schema(
    { 
        name:           {  type : String, maxlength : 130, unique : true, required : [true, 'rexource name is required'] },
        description:    {  type : String, maxlength : 100, required : [true, 'provide description for rexource'] },
        actions:        [  { type: mongoose.Schema.Types.ObjectId, ref: 'Aktion', default: [] }  ],
        deletedAt:      {  type : Date, default : null  },
    },
    { timestamps : true }
);

pageSchema.statics.findRexourceById = function(id: number)
{
    // do something;
    return this.where('_id').equals(id).count();
    // next();
};

pageSchema.statics.countRexources = function()
{
    // do something;
    return this.find({}).count();
    // next();
};

pageSchema.statics.doesRexourceExist = function(rexourceId: number)
{
    // do something;
    return this.where('_id').equals(rexourceId).count();
    // next();
};

pageSchema.statics.checkIfRexourceExist = function(rexourceName: string)
{
    // do something;
    return this.where('name').equals(rexourceName).count();
    // next();
};

pageSchema.statics.allRexource = async function()
{
    return await this.find({});
    // next();
};

export default model<any>('Page', pageSchema)