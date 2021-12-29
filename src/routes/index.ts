import { NextFunction, Request, Response } from 'express';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('<h1>Hi<h1>');
});

export default router;
