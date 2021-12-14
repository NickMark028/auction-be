import express, { Request, Response } from 'express';


const router = express.Router();
const bcrypt = require('bcryptjs');
const validate = require('../middleware/validate.mdw');
import userModel from '../models/user'
const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('./src/schema/user.json'));
router.post( '/', validate(schema),
  async function (req: Request, res: Response) {
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    
    const ret = await userModel.userModel.add(user);
    
    user = {
      id: ret[0],
      ...user,
    };
    delete user.password;

    res.status(201).json(user);
  }
);

module.exports = router;
