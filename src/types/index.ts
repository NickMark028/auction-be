import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type TRequest = Request & {
  accessTokenPayload?: string;
};

export type TResponse = Response;

export type TNext = NextFunction;
