import Router from 'koa-router';
import upload from '../middleware/upload';
import * as items from '../services/item.services';
import { UploadedFile } from '../types/upload.types';

const router = new Router();

router.post('/files/upload', upload.single('file'), async (ctx) => {
  const req = ctx.req as unknown as {
    file: UploadedFile;
    body: {
      parentId: string;
      createdBy: string;
    };
  };

  const file = req.file;
  const { parentId, createdBy } = req.body;

  ctx.body = await items.createFile({
    name: file.filename,
    parentId: parentId ? Number(parentId) : null,
    createdBy,
    fileSize: file.size,
    fileContent: file.path,
  });
});

export default router;