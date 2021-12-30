import { Request, Response, Router } from "express";
import auth from "../middleware/auth.mdw";
import validateBody from "../middleware/validateBody.mdw";

const watchListRouter = Router();

watchListRouter.patch('/', validateBody(auth), (req: Request, res: Response) => {
    
})

export default watchListRouter;
