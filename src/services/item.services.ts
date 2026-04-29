import db from '../db/knex';
import { Item, GetChildrenParams } from '../types/items.types';

// create folder
export async function createFolder(
  name: string,
  parentId: number | null,
  createdBy: string
) {
  const [id] = await db<Item>('items').insert({
    name,
    type: 'folder',
    parent_id: parentId,
    created_by: createdBy,
  });

  return {
    id,
    name,
    type: 'folder',
  };
}

  // create file
  export async function createFile(data: {
    name: string;
    parentId: number | null;
    createdBy: string;
    fileSize: number;
    fileContent: string;
  }) {
    const [id] = await db('items').insert({
      name: data.name,
      type: 'file',
      parent_id: data.parentId,
      created_by: data.createdBy,
      file_size: data.fileSize,
      file_content: data.fileContent,
    });
  
    return {
      id,
      name: data.name,
      type: 'file',
      parentId: data.parentId,
      createdBy: data.createdBy,
      fileSize: data.fileSize,
      fileContent: data.fileContent,
    };
  }
  
  export async function getChildren(params: GetChildrenParams) {
    const { parentId, page, limit, sort } = params;
  
    const query = db('items').select(
      'id',
      'name',
      'type',
      'created_by',
      'created_at',
      'file_size'
    );
  
    // ✅ handle parent
    if (parentId === null) {
      query.whereNull('parent_id');
    } else {
      query.where('parent_id', parentId);
    }
  
    // ✅ sorting
    if (sort) {
      const sortFields = sort.split(',');
  
      sortFields.forEach((field) => {
        const [column, direction] = field.split(':');
  
        const allowedColumns = ['name', 'created_at', 'file_size'];
  
        if (allowedColumns.includes(column)) {
          query.orderBy(column, direction === 'desc' ? 'desc' : 'asc');
        }
      });
    } else {
      query.orderBy('created_at', 'desc');
    }
  
    // ✅ pagination
    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);
  
    const data = await query;
  
    return {
      data,
      page,
      limit,
    };
  }

  export async function getFile(id: number) {
    return db<Item>('items')
      .where({ id, type: 'file' })
      .first();
  }