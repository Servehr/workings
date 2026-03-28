import userTypeModel from "@/model/userType.model";
import { IUserType } from "@/interfaceIUserType";


class UserTypeService {

    private post = userTypeModel;

    public async create(name: string, abbr: string, slug: string, description: string): Promise<IUserType>
    {
        try {
            const userType = await this.post.create({name, abbr, slug, description});
            return userType;
        } catch (error) {
            throw new Error('User-Type operation failed');
        }
    }

}

export default UserTypeService;