import { Request, Response, Router } from "express";
import validateQuery from "../middleware/validateQuery.mdw";
import searchSchema from '../schema/search.json';
import db from "../utils/db";
import { convertProcedureRowSetToList } from "../utils/convert";
import { PageSize } from "../enum";

const searchRouter = Router();

export type ProductQuery = {
    // Filter
    keyword: string;
    page?: number;
    category?: string;

    // Sorting
    time?: "asc | desc";
    pricing?: "asc | desc";
}

searchRouter.get('/', validateQuery(searchSchema), async (req: Request, res: Response) => {
    try {
        const {
            keyword,
            category,
            page = 1,
            pricing,
            time
        } = (req.query as unknown) as ProductQuery;

        const [rows, fields] = await db.raw('CALL SearchProduct(?, ?, ?)', [keyword, page, PageSize.SEARCH_PRODUCT]);

        res.status(200).json(convertProcedureRowSetToList(rows));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// ---------------------------------------------------------- //

export { searchRouter }
