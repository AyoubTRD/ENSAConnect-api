import { RequestHandler } from 'express';
import { UploadedFile } from 'express-fileupload';

import { v4 as uuid4 } from 'uuid';

import path from 'path';

export const uploadEndpoint: RequestHandler = async (req, res) => {
  try {
    // @ts-ignore
    const file = req.files?.file as UploadedFile;
    if (!file) {
      return res.status(400).send({
        error: 'No file uploaded',
      });
    }

    const fileName = file.name;
    const ext = fileName.split('.').at(-1);
    const savedName = uuid4() + '.' + ext;

    await file.mv(path.join(process.cwd(), 'static', savedName));

    return res.send({
      filePath:
        'http://' +
        req.hostname +
        ':' +
        process.env.PORT +
        '/rest/static/' +
        savedName,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      error: e,
    });
  }
};
