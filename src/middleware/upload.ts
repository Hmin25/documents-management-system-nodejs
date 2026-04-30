import multer from 'koa-multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

const uploadDir = path.join(os.tmpdir(), 'dms-uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    'application/pdf',
    'text/plain',
  ];

  const allowedExtensions = ['.pdf', '.txt'];

  const isValidMime = allowedMimeTypes.includes(file.mimetype);
  const isValidExt = allowedExtensions.includes(
    file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'))
  );

  if (!isValidMime && !isValidExt) {
    return cb(new Error('Only PDF and TXT files are allowed'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;