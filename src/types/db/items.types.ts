export type ItemType = 'folder' | 'file';

export interface Item {
  id: number;
  name: string;
  type: ItemType;
  parent_id: number | null;
  created_by: string;
  file_size?: number | null;
  file_content?: string;
  created_at: string;
}

export type GetChildrenParams = {
  parentId: number | null;
  page: number;
  limit: number;
  sort?: string;
  search?: string;
};