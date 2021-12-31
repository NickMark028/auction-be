import { Request, Response, Router } from "express";
import auth from "../middleware/auth.mdw";
import validateBody from "../middleware/validateBody.mdw";
import { TRequest } from "../types";

const watchListRouter = Router();

watchListRouter.patch('/', validateBody(auth), (req: TRequest, res: Response) => {
    try {
        // const { id } = req.accessTokenPayload;
        const id = 1000101; //! Hard code
        res.status(200).send();
    }
    catch (error) {
        res.status(500).json({
            error: 'Server error'
        });
    }
})

export default watchListRouter;
