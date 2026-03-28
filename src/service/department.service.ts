import department from "@/model/department";


class DepartmentService {

    
    public async categories(): Promise<Error | String | any>
    {
      return await department.find({})
    }
    

}

export default DepartmentService;