const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const validate = require("../middleware/validate.mdw")
const userModel = require("../models/user")
const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('./schema/user.json'));
router.post('/', validate(schema), async function (req, res) {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  const ret = await userModel.add(user);

  user = {
    id: ret[0],
    ...user
  }
  delete user.password;

  res.status(201).json(user);
});

module.exports = router;
