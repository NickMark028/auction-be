export type ProductQuery = {
    // Filter
    productName: string;
    page: number;
    category: string;

    // Sorting
    time: "asc | desc";
    pricing: "asc | desc";
}
