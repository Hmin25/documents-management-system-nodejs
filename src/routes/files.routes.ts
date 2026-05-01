import Router from 'koa-router';
import upload from '../middleware/upload';
import * as items from '../services/item.services';
import fs from 'fs';
import db from '../db/knex';

const router = new Router();

router.post('/files/upload', async (ctx, next) => {
  try {
    await upload.array('files', 10)(ctx, next);

    const req = ctx.req as any;
    const files = req.files;

    if (!files || files.length === 0) {
      ctx.throw(400, 'No file uploaded');
    }

    const { parentId, createdBy } = req.body;

    const results = await Promise.all(
      files.map((file: any) =>
        items.createFile({
          name: file.originalname,
          parentId: parentId ? Number(parentId) : null,
          createdBy,
          fileSize: file.size,
          fileContent: file.path,
        })
      )
    );

    ctx.body = results;
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = {
      error: err.message || 'Upload failed',
    };
  }
});

router.get('/files/:id/preview', async (ctx) => {
  const file = await items.getFile(Number(ctx.params.id));

  if (!file || !file.file_content) {
    ctx.throw(404, 'File not found');
  }

  const filePath = file?.file_content as string;

  if (!fs.existsSync(filePath)) {
    ctx.throw(404, 'File no longer available on disk');
  }

  ctx.type = 'application/pdf';
  ctx.body = fs.createReadStream(filePath);
});

// edit
router.patch('/items/:id', async (ctx) => {
  const id = Number(ctx.params.id);
  const body = ctx.request.body as { name?: string };

  const name = body.name;
  if (!name) {
    ctx.throw(400, 'Name is required');
  }

  const item = await db('items').where({ id }).first();
  if (!item) {
    ctx.throw(404, 'Item not found');
  }

  await db('items')
    .where({ id })
    .update({ name });

  ctx.body = {
    id,
    name,
    type: item.type,
  };
});

// replace
router.put('/files/:id/replace', upload.single('file'), async (ctx) => {
  const id = Number(ctx.params.id);
  const file = (ctx.req as any).file;

  if (!file) {
    ctx.throw(400, 'File is required');
  }

  const existing = await db('items')
    .where({ id, type: 'file' })
    .first();

  if (!existing) {
    ctx.throw(404, 'File not found');
  }

  await db('items')
    .where({ id })
    .update({
      name: file.originalname,
      file_content: file.path,
      file_size: file.size,
    });

  ctx.body = {
    id,
    name: file.originalname,
    type: 'file',
  };
});

export default router;