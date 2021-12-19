import { Request, Response, Router } from "express";
import { ProductQuery } from "../types";
import validateQuery from "../middleware/validateQuery.mdw";
import searchSchema from '../schema/search.json';
import knex from "knex";

const router = Router();

router.get('/', validateQuery(searchSchema), (req: Request, res: Response) => {
    try {
        const query = (req.query as unknown) as ProductQuery;
        
    } 
    catch (error) {
        res.status(500).json({
            message: 'Server error'
        });
    }
});

export { router as searchRouter }
