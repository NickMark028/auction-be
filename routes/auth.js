var express = require('express');
var router = express.Router();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken')
const randomstring = require( 'randomstring');
const validate = require("../middleware/validate.mdw")
const userModel = require("../models/user")
const login = JSON.parse(fs.readFileSync('./schema/login.json'));
const refresh = JSON.parse(fs.readFileSync('./schema/rf.json'));

router.post('/', validate(login), async function (req, res) {
  const user = await userModel.findByUserName(req.body.username);
  if (user === null) {
    return res.status(401).json({
      authenticated: false
    });
  }

  if (bcrypt.compareSync(req.body.password, user.password) === false) {
    return res.status(401).json({
      authenticated: false
    });
  }

  const opts = {
    expiresIn: 10 * 60 // seconds
  };
  const payload = {
    userId: user.id
  };
  const accessToken = jwt.sign(payload, 'SECRET_KEY', opts);

  const refreshToken = randomstring.generate(80);
  await userModel.patch(user.id, {
    rfToken: refreshToken
  });

  res.json({
    authenticated: true,
    accessToken,
    refreshToken
  });
});

router.post('/refresh', validate(refresh), async function (req, res) {
  const { accessToken, refreshToken } = req.body;
  try {
    const opts = {
      ignoreExpiration: true
    };
    const { userId } = jwt.verify(accessToken, 'SECRET_KEY', opts);
    const ret = await userModel.isValidRefreshToken(userId, refreshToken);
    if (ret === true) {
      const opts = {
        expiresIn:  10 // seconds
      };
      const payload = { userId };
      const new_accessToken = jwt.sign(payload, 'SECRET_KEY', opts);
      return res.json({
        accessToken: new_accessToken
      });
    }

    return res.status(401).json({
      message: 'Refresh token is revoked.'
    });

  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: 'Invalid access token.'
    });
  }
});
module.exports = router;