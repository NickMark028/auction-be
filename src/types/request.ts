
export type TProductQuery = {
    // Filter
    keyword?: string;
    page?: string;
    category?: string;

    // Sorting
    timeExpired?: 'asc' | 'desc';
    pricing?: 'asc' | 'desc';
};

export type TCurrentBidder = {
    productId: number;
    bidderId: number
}
  