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
import nodemailer from 'nodemailer'


const login = JSON.parse(fs.readFileSync('./src/schema/login.json'));
const refresh = JSON.parse(fs.readFileSync('./src/schema/rf.json'));

authrouter.post('/', validate(login), async function (req: Request, res: Response) {

  const user = await userModel.findByUserName(req.body.username);
  //console.log(user)
  nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: "in-v3.mailjet.com",
        port:587,
        secure: false,
        auth: {
            user: "538ef709ea08018d00e775be273dbad0",
            pass: "77272a7ae582733d53e54c790d4c9aa3"
        }
    });

    // Message object
    let message = {
        from: "Nguyễn hoàng anh tu <anh_tu0902@yahoo.com>",
        to: "anhtutai0902@gmail.com",
        subject: 'Nodemailer is unicode friendly ✔',
        text: 'Năm nới rùi, bạn gái tui đâu'
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});
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
    expiresIn: 100000 * 60, // seconds
  };
  const payload = {
    user: user.id,
  };
  const accessToken = jwt.sign(payload, 'SECRET_KEY', opts);
  console.log(req.headers)
  const refreshToken = randomstring.generate(80);
   await userModel.userModel.patch(user.id, {
     rfToken: refreshToken,
   });
  delete user.password
  res.json({
    authenticated: true,
    accessToken: accessToken,
    userInfo: user
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
      console.log(err);
      return res.status(401).json({
        message: 'Invalid access token.',
      });
    }
  }
);
export default authrouter;
