import express, { Request, Response } from 'express';

const router = express.Router()
const validate = require('../middleware/validate.mdw');
import productmodel from '../models/product'
const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('./src/schema/product.json'));
router.post('/',validate(schema),async function(req: Request, res: Response){
    let product = req.body;
    var ret =null
  try{
     ret = await productmodel.add(product);
    }
    catch(err){

    return res.status(401).json({error:err})
    }

    product = {
        id: ret[0],
        ...product,
      };


return res.status(200).json(product)


}
)
router.get("/",async function(req: Request, res: Response){
  
  var ret =null
  try{
    ret = await productmodel.findAll();
   }
   catch(err){

   return res.status(401).json({error:err})
   }

return res.status(200).json(ret)



})

router.delete("/",async function(req: Request, res: Response){
  var id = req.body.id;
  var ret=null
  try{
    ret = await productmodel.removeById(id);
   }
   catch(err){

   return res.status(401).json({error:err})
   }
   return res.status(200).json(ret)
})
router.patch("/",async function(req: Request, res: Response){
  var id = req.body.id;
  var ret=null
  try{
    ret = await productmodel.patch(id,req.body);
   }
   catch(err){

   return res.status(401).json({error:err})
   }
   return res.status(200).json(ret)
})

module.exports = router;
