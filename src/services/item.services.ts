import db from '../db/knex';
import { Item } from '../types/items';

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

  export async function getChildren(parentId: number | null) {
    return db<Item>('items')
      .select('id', 'name', 'type', 'created_by', 'created_at', 'file_size')
      .where('parent_id', parentId);
  }

  export async function getFile(id: number) {
    return db<Item>('items')
      .where({ id, type: 'file' })
      .first();
  }