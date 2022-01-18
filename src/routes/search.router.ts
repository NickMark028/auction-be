import { Request, Response, Router } from 'express';
import validateQuery from '../middleware/validateQuery.mdw';
import searchSchema from '../schema/search.json';
import db from '../utils/db';
import { convertProcedureRowSetToList } from '../utils/convert';
import { PageSize } from '../enum';
import { TProductQuery } from '../types/request';
import productModel from '../models/product.model';

const searchRouter = Router();

searchRouter.get(
  '/',
  validateQuery(searchSchema),
  async (req: Request, res: Response) => {
    try {
      const data = await productModel.searchProduct(req.query as TProductQuery);
      res.status(200).json(data);
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({
        errorMsg: 'Server internal error',
      });
    }
  }
);

// ---------------------------------------------------------- //

export default searchRouter;
