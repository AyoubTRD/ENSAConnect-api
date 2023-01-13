import { RequestHandler } from 'express';
import { UploadedFile } from 'express-fileupload';

import { v4 as uuid4 } from 'uuid';

import path from 'path';
import { AuthorizedRequest } from '../../middlewares/rest-authorized';
import { MediaFileModel } from '../../schemas/file/mediafile.schema';
import { MediaFileType } from '../../schemas/file/enums/mediafile-type.enum';

type UploadRequestBody = {
  blurhashCode?: string;
};

export const uploadRoute: (type: MediaFileType) => RequestHandler =
  (type: MediaFileType) => async (req: AuthorizedRequest, res) => {
    try {
      const body: UploadRequestBody = req.body;

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

      const filePath =
        'http://' +
        req.hostname +
        ':' +
        process.env.PORT +
        '/rest/static/' +
        savedName;

      const mediaFile = await MediaFileModel.create({
        filePath,
        blurhashCode: body.blurhashCode || '',
        userId: req.userId,
        fileType: type,
      });

      return res.send(mediaFile.toJSON());
    } catch (e) {
      console.error(e);
      return res.status(500).send({
        error: e,
      });
    }
  };
