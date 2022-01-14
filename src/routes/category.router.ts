import { Request, Response, Router } from 'express';
import db from '../utils/db';

const categoryRouter = Router();

categoryRouter.get('/', async (req: Request, res: Response) => {
  try {
    const queryString = `
      SELECT	C.section, JSON_ARRAYAGG(JSON_OBJECT(
                'id', C.id,
                'name', C.\`name\`,
                'path', C.\`path\`)
              ) AS categories
      FROM		Category C
      GROUP BY	C.section;
    `;
    const [rows, fields] = await db.raw(queryString);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

// ---------------------------------------------------------- //

categoryRouter.get('/:path', async (req: Request, res: Response) => {
  try {
    const path = req.params.path;
    const result = await db('QueryProductView')
      .where({ categoryPath: path })
      .select();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    });
  }
});

// ---------------------------------------------------------- //

categoryRouter.delete('/', async function (req: Request, res: Response) {
  try {
    const path = req.body.path;
    const result = await db('QueryProductView')
      .where({ categoryPath: path })
      .select();
    console.log(result);
    if (result.length === 0) {
      const list = await db('category').where('id', req.body.id).update('isDeleted',1);
      // console.log(list)
      return res.status(200).json({
        status: 'deleted',
      });
    }
    return res.status(404).json({
      status: 'cannot delete, category has product',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Server error',
    });
  }
});

export default categoryRouter;
