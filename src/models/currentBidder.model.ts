import { TReqBlockedBidder } from "../types/request";
import db from "../utils/db";

const currentBidderModel = {
    async getBidders(productId: number) {
        const rawQuery = `
            SELECT	BV.id, CONCAT(BV.firstName, ' ', BV.lastName) as fullName, CB.isBlocked, CB.createdAt
            FROM	CurrentBidder CB
            JOIN	BidderView BV ON CB.bidderId = BV.id
            WHERE   CB.productId = ?;
        `;

        const [rows, fields] = await db.raw(rawQuery, [productId])
        return rows as any[];
    },
    blockBidder(obj: TReqBlockedBidder) {
        return db('CurrentBidder').where(obj).update({
            isBlocked: true
        });
    },
}

export default currentBidderModel;
