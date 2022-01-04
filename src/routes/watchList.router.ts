import { Request, Response, Router } from 'express';
import validateBody from '../middleware/validateBody.mdw';
import { TRequest } from '../types';
import db from '../utils/db';

import watchListSchema from '../schema/watchList.json';

const watchListRouter = Router();

watchListRouter.patch(
  '/',
  validateBody(watchListSchema),
  async (req: TRequest, res: Response) => {
    try {
      const { userId: bidderId } = req.accessTokenPayload!;
      const { productId } = req.body;
      const rawQuery = `CALL ToggleFavoriteProduct(?, ?, @isFavorite)`;

      await db.raw(rawQuery, [bidderId, productId]);

      const [rows, fields] = await db.raw('SELECT @isFavorite AS isFavorite');

      res.status(200).json(rows[0]);
    } 
    catch (err) {
      res.status(500).json({
        error: 'Server error',
      });
    }
  }
);

watchListRouter.get('/', async (req: TRequest, res: Response) => {
  try {
    const { userId: bidderId } = req.accessTokenPayload!;
    const rawQuery = `
            SELECT		PV.*, WLV.createdAt AS dateFavorited
            FROM	  	WatchListView WLV
            JOIN 	  	ProductView PV ON PV.id = WLV.productId
            WHERE 		WLV.bidderId = ?
            ORDER BY	PV.id DESC;
        `;
    const [rows, fields] = await db.raw(rawQuery, [bidderId]);

    res.status(200).send(rows);
  } catch (err) {
    res.status(500).json({
      error: 'Server error',
    });
  }
});

export default watchListRouter;
