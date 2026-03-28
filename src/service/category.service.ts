import category from "@/model/category";




class CategoryService {

    
    public async categories(): Promise<Error | String | any>
    {
      return await category.find({})
    }
    

}

export default CategoryService;