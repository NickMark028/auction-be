import { Request, Response, Router } from "express";
import { validateBody } from "../middleware";
import { blockedBidderModel } from "../models/blockedBidder.model";
import blockedBidderSchema from '../schema/blockedBidder.json';
import { TRequest } from "../types";

const blockedBidderRouter = Router();

blockedBidderRouter.get('/:productId', async (req: TRequest, res: Response) => {
    try {
        const { productId } = req.body
        const blockedbidders = await blockedBidderModel.findByProductId(productId);

        res.status(200).json({
            blockedbidders
        })
    } catch (error) {
        res.status(500).json({
            error: 'Server error'
        })
    }
})

blockedBidderRouter.post('/', validateBody(blockedBidderSchema), (req: TRequest, res: Response) => {
    try {
        const { bidderId, productId } = req.body;
        const rowEffected = blockedBidderModel.insert(bidderId, productId);

        res.status(201).json({
            rowEffected
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error'
        })
    }
})

export default blockedBidderRouter;
