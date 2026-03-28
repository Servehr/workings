import role from "@/model/role";


class RoleService {

    
    public async categories(): Promise<Error | String | any>
    {
      return await role.find({})
    }
    

}

export default RoleService;