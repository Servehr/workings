import { Model, Document, FilterQuery, ProjectionType } from 'mongoose';

// 1. Define the pagination options interface
export interface PaginationOptions 
{
  page?: number;
  limit?: number;
  sort?: string | { [key: string]: 1 | -1 };
}

// 2. Define the response structure
export interface PaginatedResult<T> 
{
  data: T[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// 3. Create the reusable function
export const paginate = async <T extends Document>(model: Model<T>, filter: FilterQuery<T> = {}, options: PaginationOptions = {}, field: string, populate: any, projection: ProjectionType<T> = {}): Promise<PaginatedResult<T>> => 
{
  
  const page = Math.max(1, options.page || 1)
  const limit = Math.max(1, options.limit || 10)
  const skip = (page - 1) * limit

  let data: any

  // if (model.schema.path('account')) 
  // console.log(populate)
  if(populate)
  {
    data = await model.find(filter, projection)
      .sort(options.sort || { _id: -1 })
      .populate([populate])
      .skip(skip)
      .limit(limit)
      .select(field)
      .exec()
  } else {
    data = await model.find(filter, projection).sort(options.sort || { _id: -1 })
      .skip(skip)
      .limit(limit)
      .select(field)
      .exec()
  }

  const totalDocs = await model.countDocuments(filter).exec()
     
  // Run queries in parallel
  // const [data, totalDocs] = await Promise.all(
  //   [
  //     model.find(filter, projection)
  //      .sort(options.sort || { _id: -1 })
  //      .populate(populate)
  //      .skip(skip)
  //      .limit(limit)
  //      .select(field)
  //      .exec(),
  //     model.countDocuments(filter).exec(),
  //   ]);

  const totalPages = Math.ceil(totalDocs / limit);

  return {
    data,
    totalDocs,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};