import express, { Express, Request, Response } from 'express';
const app = express();
const router = express.Router();
import bodyParser from 'body-parser';
import multer from 'multer';
const upload = multer();


const authority = require('../../controller/authorize/authority');



router.get('/user-priviledge/:user-id/:role-id', authority.authorize.userPriviledge);

router.put('/role/:user-id/:from-roles/:to-roles', authority.authorize.swapRoles);

router.post('/attach-priviledge-to-role', authority.authorize.attachPriviledge);

router.post('/dettach-priviledge-from-role', authority.authorize.detachPriviledge);

router.post('/assign-role-to-user/:user-id', authority.authorize.grantRoles);

router.post('/revoke-role-from-user/:user-id', authority.authorize.revokeRoles);

router.delete('/restrict-user/:user-id/:roles-id/:priviledge:id', authority.authorize.restrictUser);

router.delete('/attach-right-to-user/:user-id/:roles-id/:priviledge:id', authority.authorize.attachRight);

router.get('/priviledges/:role_id', authority.authorize.rolesWithPrivileges);



module.exports = router;