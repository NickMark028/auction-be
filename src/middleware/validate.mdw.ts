const Ajv = require('ajv');

function validate(schema) {
  return function (req, res, next) {
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
