import fs from 'fs';
import db from '../db/knex';
import { Item, GetChildrenParams } from '../types/db/items.types';
import { FileDTO, FolderDTO } from '../types/http/file-folder.dto';

// create folder
export async function createFolder(
  name: string,
  parentId: number | null,
  createdBy: string
): Promise<FolderDTO> {
  const [id] = await db('items').insert({
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
  }): Promise<FileDTO> {
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
    const { parentId, page, limit, sort, search } = params;
  
    const query = db('items').select(
      'id',
      'name',
      'type',
      'created_by',
      'created_at',
      'file_size',
      'file_content'
    );
  
    if (parentId === null) {
      query.whereNull('parent_id');
    } else {
      query.where('parent_id', parentId);
    }
    
    // ✅ search FIRST (before sorting)
    if (search) {
      query.where(function () {
        this.where('name', 'like', `%${search}%`)
            .orWhere('created_by', 'like', `%${search}%`);
      });
    }
    
    // ✅ THEN stable grouping
    query.orderBy('type', 'asc');
    
    // ✅ sorting
    if (sort) {
      const sortFields = sort.split(',');
    
      sortFields.forEach((field) => {
        const [column, direction] = field.split(':');
    
        const allowedColumns = ['name', 'created_at', 'created_by', 'file_size'];
    
        if (!allowedColumns.includes(column)) return;
    
        if (column === 'file_size') {
          query.orderByRaw(`
            file_size IS NULL ASC,
            file_size ${direction === 'desc' ? 'DESC' : 'ASC'}
          `);
        } else {
          query.orderBy(column, direction === 'desc' ? 'desc' : 'asc');
        }
      });
    } else {
      query.orderBy('created_at', 'desc');
    }
  
    // ✅ pagination
    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);
  
    // file missing, do not return
    const rows = await query;

    const data = rows
      .filter((item) =>
        item.type !== 'file' || (item.file_content && fs.existsSync(item.file_content))
      )
      .map(({ file_content, ...rest }) => rest);

    return {
      data,
      page,
      limit,
    };
  }

  export async function getFile(id: number): Promise<Item | null> {
    const file = await db<Item>('items')
      .where({ id, type: 'file' })
      .first();
  
    return file ?? null;
  }