import express, { Request, Response } from 'express';


const userrouter = express.Router();
const bcrypt = require('bcryptjs');
import validate from '../middleware/validateBody.mdw'
import userModel from '../models/user';
const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('./src/schema/user.json'));

userrouter.post(
  '/',
  validate(schema),
  async function (req: Request, res: Response) {
    let user = req.body;
    console.log(req.body)
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
userrouter.get('/',async function (req: Request, res: Response) {
  try {
    const ret = await userModel.userModel.findAll()
    res.status(201).json(ret)
  } catch (error) {
    res.status(401).json(error)
  }
  

  


});
userrouter.delete('/',async function (req: Request, res: Response) {
  console.log(req.body.id)

res.status(201).json({
  status:"success"
})
})
userrouter.get('detail',async function name(req: Request, res: Response) {
  console.log(req.body.id)
  const ret = await userModel.userModel.findById("")
  
})
export default userrouter
