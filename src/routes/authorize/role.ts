import express, { Express, Request, Response } from 'express';
const app = express();
import bodyParser from 'body-parser';
const router = express.Router();
import multer from 'multer';
const upload = multer();

const authority = require('../../controller/authorize/role');



router.get('/all', authority.roles.allRoles);

router.post('/create', authority.roles.addRole);

router.put('/update', authority.roles.updateRole);

router.delete('/delete/:role_id', authority.roles.deleteRole);

router.get('/find/:role_id', authority.roles.findRole);

// router.delete('/role/search', authority.roles.searchRole);


module.exports = router;