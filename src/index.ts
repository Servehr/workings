import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import UserTypeController from './controller/authorize/user.type.controller';
import AuthController from './controller/authenticate/auth.controller';
import ProfileController from './controller/user/profile.controller';
import CategoryController from './controller/management/Category.controller';
import DepartmentController from './controller/management/department.controller';
import RoleController from './controller/management/role.controller';
import RexourceController from './controller/management/rexource.controller';
import PageController from './controller/management/page.controller';
import ActionController from './controller/management/action.controller';
import PaymentController from './controller/paymet.controller.';
import DivisionController from './controller/management/division.controller';
import JobController from './controller/job.controller';
import CountryController from './controller/management/location/country.controller';
import StateController from './controller/management/location/state.controller';
import LgaController from './controller/management/location/lga.controller';
import NotificationController from './controller/settings/notification.controller';
import UserController from './controller/management/user.controller';
import AboutController from './controller/cms/about.controller';

validateEnv();

const app = new App(
    [
        new UserTypeController(),
        new AuthController(),
        // new ProfileController(),
        new CategoryController(),
        new DepartmentController(),
        new RoleController(),
        new RexourceController(),
        new UserController(),
        new PageController(),
        new ActionController(),
        new PaymentController(),
        new DivisionController(),
        new JobController(),
        new CountryController(),
        new StateController(),
        new LgaController(),
        new NotificationController(),
        new AboutController()
    ], 
    Number(process.env.PORT)
);

app.listen();