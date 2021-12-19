import db from '../utils/db';

type Identifier = string | number;

export default function generator(tableName: string, idField: string) {
  return {
    findAll() {
      return db(tableName);
    },

    async findById(id: Identifier) {
      const list = await db(tableName).where(idField, id);
      if (list.length === 0) return null;

      return list[0];
    },

    add(entity: object) {
      return db(tableName).insert(entity);
    },

    removeById(id: Identifier) {
      return db(tableName).where(idField, id).del();
    },

    patch(id: Identifier, entity: object) {
      return db(tableName).where(idField, id).update(entity);
    },
  };
}
