export interface FileDTO {
  id: number;
  name: string;
  type: 'file';
  parentId: number | null;
  createdBy: string;
  fileSize: number;
  fileContent: string;
}

export interface FolderDTO {
  id: number;
  name: string;
  type: 'folder';
}