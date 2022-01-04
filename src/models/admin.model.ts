import db from '../utils/db';
import generate from './generic.model';

const adminDefaultModel = generate('changerolelog', 'id');

const adminModel = {
  ...adminDefaultModel,
};
export default adminModel;
