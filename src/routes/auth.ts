import { Request, Response } from 'express';
const express = require('express');
const authrouter = express.Router();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
import validate from '../middleware/validateBody.mdw'
//const userModel = require('../models/user');
import userModel from '../models/user'



const login = JSON.parse(fs.readFileSync('./src/schema/login.json'));
const refresh = JSON.parse(fs.readFileSync('./src/schema/rf.json'));

authrouter.post('/', validate(login), async function (req: Request, res: Response) {

  const user = await userModel.findByUserName(req.body.username);
  console.log(user)

  if (user === null) {
    return res.status(401).json({
      authenticated: false,
    });
  }
  try{
    
  if (bcrypt.compareSync(req.body.password, user.password) === false) {
    return res.status(401).json({
      authenticated: false,
    });
  }}
  catch(err){
    console.log(err)
  }

  const opts = {
    expiresIn: 10 * 60, // seconds
  };
  const payload = {
    userId: user.id,
  };
  const accessToken = jwt.sign(payload, 'SECRET_KEY', opts);

  const refreshToken = randomstring.generate(80);
  // await userModel.userModel.patch(user.id, {
  //   rfToken: refreshToken,
  // });
  delete user.password
  res.json({
    authenticated: true,
    user
  });
});

authrouter.post(
  '/refresh',
  validate(refresh),
  async function (req: Request, res: Response) {
    const { accessToken, refreshToken } = req.body;
    try {
      const opts = {
        ignoreExpiration: true,
      };
      const { userId } = jwt.verify(accessToken, 'SECRET_KEY', opts);
      const ret = await userModel.isValidRefreshToken(userId, refreshToken);
      if (ret === true) {
        const opts = {
          expiresIn: 10, // seconds
        };
        const payload = { userId };
        const new_accessToken = jwt.sign(payload, 'SECRET_KEY', opts);
        return res.json({
          accessToken: new_accessToken,
        });
      }

      return res.status(401).json({
        message: 'Refresh token is revoked.',
      });
    } catch (err) {
      if (process.env.NODE_ENV === 'develop') console.log(err);

      return res.status(401).json({
        message: 'Invalid access token.',
      });
    }
  }
);
export default authrouter;
