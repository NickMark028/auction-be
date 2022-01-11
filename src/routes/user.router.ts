import express, { Request, Response } from 'express';
import { validateBody } from '../middleware';
import bcrypt from 'bcryptjs';
import userModel from '../models/user.model';

import schema from '../schema/user.json';
import bidderModel from '../models/bidder.model';
import adminModel from '../models/admin.model';
import sellerModel from '../models/seller.model';
import nodemailer from 'nodemailer';
import db from '../utils/db';
import { authenticator, totp, hotp } from '@otplib/preset-v11';

const userRouter = express.Router();

userRouter.post(
  '/',
  validateBody(schema),
  async function (req: Request, res: Response) {
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);

    try {
      const rawQuery = `CALL RegisterBidder(?, ?, ?, ?, ?, ?, ?);`;
      await db.raw(rawQuery, [
        user.username,
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.address,
        user.dateOfBirth,
      ]);
    } catch (err) {
      return res.status(400).json({
        errorMsg: err,
      });
    }

    delete user.password;

    return res.status(201).send();
  }
);

userRouter.get('/', async function (req: Request, res: Response) {
  try {
    const ret = await userModel.findAll();
    return res.status(201).json(ret);
  } catch (err) {
    return res.status(401).json(err);
  }
});

userRouter.delete('/', async function (req: Request, res: Response) {
  console.log(req.body.id);

  try {
    const ret = await userModel.removeById(req.body.id);
    return res.status(201).json(ret);
  } catch (err) {
    return res.status(401).json(err);
  }
});

userRouter.get('/profile', async function (req: Request, res: Response) {
  try {
    console.log(req.query);
    const id: any = req.query.id;
    var ret = await userModel.findById(id);
    delete ret.password;
    var date = new Date(ret.dateOfBirth.toString());
    var date1 =
      date.getFullYear().toString() +
      '-' +
      (date.getMonth() + 1).toString() +
      '-' +
      date.getDate().toString();
    console.log(date1);
    return res.status(201).json({
      username: ret.username,
      firstName: ret.firstName,
      lastName: ret.lastName,
      email: ret.email,
      dateOfBirth: date1,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
});

userRouter.patch('/profile', async function (req: Request, res: Response) {
  try {
    console.log(req.body);

    await userModel.patch(req.body.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
    });

    return res.status(201).json({
      status: 'update complete',
    });
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
});

userRouter.patch(
  '/reset-password',
  async function (req: Request, res: Response) {
    try {
      console.log(req.body);
      const ret = await userModel.findById(req.body.id);
      if (!bcrypt.compareSync(req.body.current_pass, ret.password)) {
        return res.status(404).json({
          status: 'wrong password',
        });
      }
      const newpass = bcrypt.hashSync(req.body.new_pass, 10);
      await userModel.patch(req.body.id, {
        password: newpass,
      });
      return res.status(201).json({
        status: 'update complete',
      });
    } catch (error) {
      return res.status(404).json(error);
    }
  }
);
userRouter.post('/role', async function (req: Request, res: Response) {
  var role = null;
  try {
    if ((await adminModel.findadmin(req.body.id)) != null) {
      role = 'admin';
    }
    if ((await sellerModel.findseller(req.body.id)) != null) {
      role = 'seller';
    }
    if ((await bidderModel.findById(req.body.id)) != null && role == null) {
      role = 'bidder';
    }
    if (role == null) {
      return res.status(404).json({
        status: 'role not found',
      });
    }
    return res.status(201).json({
      role: role,
    });
  } catch (error) {
    return res.status(401).json({
      status: error,
    });
  }
});
userRouter.post('/mail', async function (req: Request, res: Response) {
  totp.options = { epoch: Date.now(), digits: 6, step: 30000 };
  const otp = totp.generate(req.body.email);

  console.log(otp);

  let transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '538ef709ea08018d00e775be273dbad0', // generated ethereal user
      pass: '77272a7ae582733d53e54c790d4c9aa3', // generated ethereal password
    },
  });
  let info = await transporter.sendMail({
    from: '"Anh Tu - do not reply" <18127243@student.hcmus.edu.vn>', // sender address
    to: req.body.email, // list of receivers
    subject: 'Email from auction please do not reply', // Subject line
    text: 'Hello world from tu with love your otp is:' + otp, // plain text body
  });
  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return res.status(201).json({ status: 'ok' });
});
userRouter.post('/verify-otp', async function (req: Request, res: Response) {
  console.log(req.body);
  const check = totp.check(req.body.otp, req.body.email);
  console.log(check);
  //console.log(totp.verify({token:req.body.otp,secret:req.body.email}))
  // console.log(hotp.timeRemaining())
  if (check) {
    return res.status(201).json({ status: check });
  }
  return res.status(401).json({ status: check });
});

export default userRouter;
