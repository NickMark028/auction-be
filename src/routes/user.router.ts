import express, { Request, Response } from 'express';
import { validateBody } from '../middleware';
import bcrypt from 'bcryptjs';
import userModel from '../models/user.model';
import schema from '../schema/user.json';

const userRouter = express.Router();

userRouter.post(
  '/',
  validateBody(schema),
  async function (req: Request, res: Response) {
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    var ret=null
    try{
    ret = await userModel.add(user);
    }
    catch(err){
   return  res.status(401).json(err)
    }
    user = {
      id: ret,
      ...user,
    };
    delete user.password;

 return   res.status(201).json(user);
  }
);
userRouter.get('/',async function (req: Request, res: Response) {
  try{
    const ret = await userModel.findAll();
    return res.status(201).json(ret)
    }
    catch(err){
   return  res.status(401).json(err)
    }

})
userRouter.delete('/',async function (req: Request, res: Response) {
  console.log(req.body.id)

   try{
    const ret = await userModel.removeById(req.body.id);
    return res.status(201).json(ret)
    }
    catch(err){
   return  res.status(401).json(err)
    }
})
userRouter.get('/profile',async function (req: Request, res: Response) {
  try {
    console.log(req.query)
    const id:any =req.query.id
    var ret = await userModel.findById(id);
    delete ret.password
    var date =new Date(ret.dateOfBirth.toString())
   var date1= date.getFullYear().toString()+'-' + (date.getMonth()+1).toString()+'-'  +date.getDate().toString() 
   console.log(date1)
    return res.status(201).json({
      username: ret.username,
      firstName: ret.firstName,
      lastName: ret.lastName,
      email: ret.email,
      dateOfBirth: date1,
      })
  } catch (error) {
    console.log(error)
    return res.status(404).json(error)
  }
})
userRouter.patch('/profile',async function (req: Request, res: Response){
  try {
    console.log(req.body)
  
     await userModel.patch(req.body.id,{
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth
    })
    
    return res.status(201).json({
      status:"update complete"
    })
  } catch (error) {
    return res.status(201).json({
      error
    })
  }

})
userRouter.patch('/reset-password',async function (req: Request, res: Response){

  try {
    console.log(req.body)
    const ret = await userModel.findById(req.body.id)
    if(!bcrypt.compareSync(req.body.current_pass, ret.password)){
      return res.status(404).json({
        status:"wrong password"
      })
    }
    const newpass=bcrypt.hashSync(req.body.new_pass, 10)
    await userModel.patch(req.body.id, {
      password: newpass,
    });
    return res.status(201).json({
      status:"update complete"
    })
  } catch (error) {
    return res.status(404).json(error)
  }
} )
export default userRouter;
