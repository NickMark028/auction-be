import e, { Request, Response, Router } from "express";
import db from "../utils/db";

const categoryRouter = Router();

categoryRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await db('QueryCategoryView').select();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            error: 'Server error'
        });
    }
})

// ---------------------------------------------------------- //

categoryRouter.get('/:path', async (req: Request, res: Response) => {
    try {
        const path = req.params.path;
        const result = await db('QueryProductView').where({ path }).select();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            error: e.toString()
        });
    }
})

// ---------------------------------------------------------- //

export { categoryRouter }
