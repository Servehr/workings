import express, { Express, Request, Response } from 'express';
const app = express();
const router = express.Router();
import bodyParser from 'body-parser';
import multer from 'multer';
const upload = multer();

const authenticateUser = require('../../controller/authenticate/authenticate');


// router.post('/login', authenticateUser.authentication.loginUser);

router.post('/register', authenticateUser.authentication.signUp)

// router.post('/forgot', authenticateUser.authentication.forgot)

// router.post('/change/:id', authenticateUser.authentication.change)

// router.post('/reset/:id/:code', authenticateUser.authentication.reset)
 
// router.post('/logout', authenticateUser.authentication.logout);

// router.delete('/delete/:id', authenticateUser.authentication.deleteUser);

module.exports = router;