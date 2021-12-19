import { Request, Response, Router } from "express";
import validateQuery from "../middleware/validateQuery.mdw";

const router = Router();

import searchSchema from '../schema/search.json';

router.get('/', validateQuery(searchSchema), (req: Request, res: Response) => {
    res.json(req.query);
});

export { router as searchRouter }
