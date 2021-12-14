const Ajv = require('ajv');

function validate(schema: any) {
  return function (req: { body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): any; new(): any; }; }; }, next: () => void) {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      return res.status(400).json(ajv.errors);
    }

    next();
  };
}
module.exports = validate;
// export default schema => (req, res, next) => {
//   const ajv = new Ajv();
//   const valid = ajv.validate(schema, req.body);
//   if (!valid) {
//     return res.status(400).json(ajv.errors);
//   }
//
//   next();
// }
