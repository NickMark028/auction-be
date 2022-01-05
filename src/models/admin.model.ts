import db from '../utils/db';
import generate from './generic.model';

const adminDefaultModel = generate('changerolelog', 'id');

const admin = generate('admin','id')

async function findadmin(id:any) {
 return admin.findById(id);
}
const adminModel = {
  ...adminDefaultModel,
  findadmin
};
export default adminModel;
