import express, { Request, Response } from 'express';
import randomstring from 'randomstring';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateBody } from '../middleware';
import login from '../schema/login.json';
import refresh from '../schema/rf.json';
import userModel from '../models/user.model';
import adminModel from '../models/admin.model';
import sellerModel from '../models/seller.model';
import bidderModel from '../models/bidder.model';

const authRouter = express.Router();

authRouter.post(
  '/',
  validateBody(login),
  async function (req: Request, res: Response) {
    const user = await userModel.findByUserName(req.body.username);

    if (user === null) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    const opts = {
      expiresIn: 1 * 60, // seconds
    };
    const payload = {
      userId: user.id,
    };
    const accessToken = jwt.sign(payload, 'SECRET_KEY', opts);
    const refreshToken = randomstring.generate(80);

    await userModel.patch(user.id, {
      rfToken: refreshToken,
    });
var role = null;
    try {
      if ((await adminModel.findadmin(user.id)) != null) {
        role = 'admin';
      }
      if ((await sellerModel.findseller(user.id)) != null) {
        role = 'seller';
      }
      if ((await bidderModel.findById(user.id)) != null && role == null) {
        role = 'bidder';
      }
      if (role == null) {
       role = 'not found'
      }
    } catch (error) {
    console.log(error)
    }
    delete user.password;
    user.rfToken = refreshToken
    res.json({
      authenticated: true,
      accessToken,
      user_role:role,
      user_info: user,
    });
  }
);

authRouter.post(
  '/refresh',
  validateBody(refresh),
  async function (req: Request, res: Response) {
    const { accessToken, refreshToken } = req.body;
    try {
      const opts = {
        ignoreExpiration: true,
      };
      const { userId } = jwt.verify(accessToken, 'SECRET_KEY', opts) as {
        userId: string;
      };
      const ret = await userModel.isValidRefreshToken(userId, refreshToken);
      if (ret === true) {
        const opts = {
          expiresIn: 1000, // seconds
        };
        const payload = { userId };
        const new_accessToken = jwt.sign(payload, 'SECRET_KEY', opts);
        return res.status(201).json({
          accessToken: new_accessToken,
        });
      }

      return res.status(401).json({
        message: 'Refresh token is revoked.',
      });
    }
    catch (err) {
      // if (process.env.NODE_ENV === 'develop')
      //   console.log(err);

      return res.status(401).json({
        message: 'Invalid access token.',
      });
    }
  }
);

export default authRouter;
