export type ProductQuery = {
    // Filter
    keyword: string;
    page?: number;
    category?: string;

    // Sorting
    time?: "asc | desc";
    pricing?: "asc | desc";
}
