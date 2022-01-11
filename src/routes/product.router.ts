import express, { Request, Response } from 'express';
import schema from '../schema/product.json';
import { validateBody } from '../middleware';
const cloudinary =require('cloudinary')
import db from '../utils/db';
import productModel from '../models/product.model';
import sellerModel from '../models/seller.model';

const productRouter = express.Router();
cloudinary.config({ 
  cloud_name: process.env.IC_NAME, 
  api_key: process.env.IC_API_KEY, 
  api_secret: 
  process.env.IC_SECRET
});
productRouter.post( '/', async function (req: Request, res: Response) {
    let product = req.body.product;
  

 //   return res.status(201).json({status:"ok"})
   // console.log(req.body.product.coverImageUrl)
    try {
      const check = await sellerModel.findById(product.sellerId)
      if(check==null){
        return res.status(404).json({status:"you are not seller"})
      }
    } catch (error) {
      return res.status(404).json({status:error})
    }
    const time = new Date().getTime();
  
    const category=product.category

    try {
      await  cloudinary.v2.uploader.upload(product.coverImageUrl,
        { 
          public_id: product.name +"_cover_"+time,
          folder: process.env.IMG_FOLDER+product.sellerId+'/'+time}, 
        function(error:any, result:any) {
          if(result!=undefined){
          product.coverImageUrl=result.url
        }
        
        })
        const temp:any=[];
        var i=0;
     for(const element of product.productImage) {
        await  cloudinary.v2.uploader.upload(element,
            { 
              public_id: product.name +"_image("+i+")"+time,
              folder: process.env.IMG_FOLDER+product.sellerId+'/'+time}, 
          async  function(error:any, result:any) {
            if(result!=undefined){
              // element=result.url
                temp.push(result.url)
              }
            
            });
    
            i++
        }
  
        delete product.productImage
        delete product.category
 
      const ret = await productModel.add(product);
      product = {
        id: ret[0],
        ...product,
      };

      await productModel.addBidded(product.id,product.reservedPrice)

      category.forEach(async(element: any) => {
        await productModel.addCategory(product.id,element.id)
      });
      temp.forEach(async(element: any) => {
       await productModel.addimage(product.id,element)
      });
      return res.status(200).json(product);
    } catch (err) {
      return res.status(401).json({ error: err });
    }

  }
);

productRouter.get('/top-near-end', async (req: Request, res: Response) => {
  try {
    const rawQuery = `
      SELECT		*
      FROM		  ProductView PV
      ORDER BY	TIME_TO_SEC(TIMEDIFF(NOW(), NOW() - INTERVAL 1 MONTH)) ASC
      LIMIT 		8;
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: 'Server internal error',
    });
  }
});

productRouter.get('/top-priciest', async (req: Request, res: Response) => {
  try {
    const rawQuery = `
      SELECT		*
      FROM	  	ProductView PV
      ORDER BY	IF(PV.currentPrice IS NULL, PV.reservedPrice, PV.currentPrice) DESC
      LIMIT 		8;
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: 'Server internal error',
    });
  }
});

productRouter.get('/top-auction-log', async (req: Request, res: Response) => {
  try {
    const rawQuery = `
      SELECT		*
      FROM	  	ProductView PV
      ORDER BY	PV.auctionLogCount DESC
      LIMIT 		8;
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: 'Server internal error',
    });
  }
});

productRouter.get('/:id', async (req, res) => {
  try {
    const product = await productModel.detailProduct(req.params.id);
    res.send(product).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

productRouter.get('/detailproduct/:id', async (req, res) => {
  try {
    const product = await productModel.detailProduct(req.params.id);
    res.send(product).status(201);
  } catch (err) {
    console.log(err)
    return res.status(401).json({ error: err });
  }
});

//5sp cùng cate/ related
productRouter.get('/related/:section', async (req, res) => {
  try {
    const pdrelated = await productModel.pb_related(req.params.section);
    res.send(pdrelated).status(201);
  } catch (error) {
    res.send(error).status(401);
  }
});
productRouter.get('/topbidder/:id', async (req, res) => {
  try {
    const rawQuery = `
    select * from auction.bidhistoryview
 where price = (select max(price) from auction.bidhistoryview where productId=${req.params.id}) 
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({
      error: 'Server internal error',
    });
  }
});

productRouter.get('/', async (req, res) => {
  try {
    const product = await productModel.findAll();
    res.send(product).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

productRouter.delete('/',async (req, res) => {
  try {
  await  productModel.removeById(req.body.id)
    return res.status(200).json({
      status:"delete success"
    })
  } catch (error) {
    return res.status(401).json({
      status:error
  })
}})

productRouter.post('/update',async (req, res) =>{
try {
  const value =await productModel.updateDescription(req.body.id,req.body.value);
  return res.status(201).json({value:value})
} catch (error) {
  return res.status(400).json({error})
}
 
})


export default productRouter;
