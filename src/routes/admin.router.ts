import express, { Request, Response } from 'express';
import adminModel from '../models/admin.model';
import generate from '../models/generic.model';
import db from '../utils/db';
const adminRouter = express.Router();
const adminSecondmodel = generate('admin', 'id');
//danh sách nâng cấp tài khoản
adminRouter.get('/change-role-view', async (req, res) => {
  const rawquery = `
    select * from changerolelog where statusCode = 100
    `;
  const rows = await db.raw(rawquery);

  if (rows.length == 0) return null;
  res.status(200).json(rows[0]);
});

adminRouter.patch('/acceptRole/:id', async (req, res) => {
  try {
    const rawquery = `
    update auction.changerolelog set statusCode= 200 where bidderId = ${req.params.id}
    `;
    await db.raw(rawquery);

    res.status(200).send('accept successful!');
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
});

adminRouter.patch('/delineRole/:id', async (req, res) => {
  try {
    const rawquery = `
    update auction.changerolelog set statusCode= 201 where bidderId = ${req.params.id}
    `;
    await db.raw(rawquery);

    res.status(200).send('deline bidder successful!');
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
});

adminRouter.patch('/downgradeRole/:id', async (req, res) => {
  try {
    const rawquery = `
    update auction.changerolelog set statusCode= 400 where bidderId = ${req.params.id}
    `;
    await db.raw(rawquery);

    res.status(200).send('dơngrade bidder successful!');
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
});
 adminRouter.post('/check-role',async (req, res) =>{
try {
  const check = await adminSecondmodel.findById(req.body.id)
  if(check!=null){
    return res.status(201).json({
      role:"admin"
    })
  }
  return res.status(404).json({
    role:"not admin"
  })
} catch (error) {
  return res.status(404).json({
    error
  })
}
  
 })

export default adminRouter;
