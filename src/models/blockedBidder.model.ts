import db from "../utils/db"

const blockedBidderModel = {
    insert(bidderId: number, productId: number) {
        return db('BlockedBidder').insert({
            bidderId,
            productId
        })
    },
    findByProductId(productId: number) {
        return db('BlockedBidder').select('bidderId', 'productId');
    }
}

export { blockedBidderModel }
