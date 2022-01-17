import { NextFunction, Response } from "express";
import sellerModel from "../models/seller.model";
import { TRequest } from "../types";

export default async function isSeller(req: TRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.accessTokenPayload!.userId;
        if (await sellerModel.findById(userId)) {
            next();
            return;
        }

        res.status(403).json({
            errorMsg: 'Client is not authorization as a seller'
        })
        return;
    }
    catch (error) {
        res.status(500).json({
            errorMsg: 'Server internal error'
        });
    }
}
