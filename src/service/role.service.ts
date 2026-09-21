import Role from "@/model/management/role";


class RoleService {

    
    public async categories(): Promise<Error | String | any>
    {
      return await Role.find({})
    }
    

}

export default RoleService;