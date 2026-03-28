import express, { Express, Request, Response } from 'express';
const app = express();
import session from 'express-session';
const router = express.Router();
import bodyParser from 'body-parser';
import multer from 'multer';
const upload = multer();


const authority = require('../../controller/authorize/privilege');



router.get('/all', authority.privilege.allPrivileges) 

router.post('/create', authority.privilege.addPrivilege);

router.put('/update', authority.privilege.updatePrivilege)

router.delete('/delete/:id', authority.privilege.deletePrivileges);

router.get('/find/:id', authority.privilege.findPrivilege);


module.exports = router;