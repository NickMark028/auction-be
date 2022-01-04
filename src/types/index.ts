import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type TJWTPayload = {
  userId: number;
  iat: number;
  exp: number;
}
export type TRequest = Request & {
  accessTokenPayload?: TJWTPayload;
};

export type TResponse = Response;

export type TNext = NextFunction;
