import db from '../utils/db';

export default function (table_name: any, id_field: any) {
  return {

    findAll() {
      return db(table_name);
    },

    async findById(id: any) {
      const list = await db(table_name).where(id_field, id);
      if (list.length === 0)
        return null;

      return list[0];
    },

    add(entity: any) {
      return db(table_name).insert(entity);
    },

    removeById(id: any) {
      return db(table_name)
        .where(id_field, id)
        .del();
    },

    patch(id: any, entity: any) {
      return db(table_name)
        .where(id_field, id)
        .update(entity);
    }
  }
}