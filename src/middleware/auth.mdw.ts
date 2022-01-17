import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TJWTPayload, TRequest } from '../types';

export default function auth(req: TRequest, res: Response, next: NextFunction) {
  const accessToken = req.headers['authorization'] as string | undefined;

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken.slice('Bearer '.length),
        'SECRET_KEY'
      );
      req.accessTokenPayload = decoded as TJWTPayload;

      next();
    } catch (err) {
      if (process.env.NODE_ENV === 'develop') console.log(err);

      return res.status(401).json({
        message: 'Invalid access token.',
      });
    }
  }
  else {
    return res.status(401).json({
      message: 'Access token not found.',
    });
  }
}
