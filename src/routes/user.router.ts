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

    const ret = await userModel.add(user);

    user = {
      id: ret[0],
      ...user,
    };
    delete user.password;

    res.status(201).json(user);
  }
);

export default userRouter;
