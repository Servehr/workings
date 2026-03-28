import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import UserTypeController from './controller/authorize/user.type.controller';
import AuthController from './controller/authenticate/auth.controller';
import ProfileController from './controller/user/profile.controller';
import CategoryController from './controller/user/category.controller';
import DepartmentController from './controller/user/department.controller';
import RoleController from './controller/user/role.controller';

validateEnv();

const app = new App(
    [
        new UserTypeController(),
        new AuthController(),
        new ProfileController(),
        new CategoryController(),
        new DepartmentController(),
        new RoleController()
    ], 
    Number(process.env.PORT)
);

app.listen();