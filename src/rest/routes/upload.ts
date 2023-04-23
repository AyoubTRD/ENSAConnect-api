import { RequestHandler } from 'express';
import { UploadedFile } from 'express-fileupload';

import { v4 as uuid4 } from 'uuid';

import path from 'path';
import { AuthorizedRequest } from '../../middlewares/rest-authorized';
import { MediaFileModel } from '../../schemas/file/mediafile.schema';
import { MediaFileType } from '../../schemas/file/enums/mediafile-type.enum';
import { VideoService } from '../../services/video.service';

type UploadRequestBody = {
  blurhashCode?: string;
};

const videoService = new VideoService();

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
      const randomName = uuid4();
      const savedName = randomName + '.' + ext;

      const filePath = path.join(process.cwd(), 'static', savedName);
      await file.mv(filePath);

      const fileUrl =
        (process.env.HTTPS ? 'https://' : 'http://') +
        req.hostname +
        ':' +
        process.env.PORT +
        '/rest/static/' +
        savedName;

      let thumbnailUrl: string;

      if (type === MediaFileType.VIDEO) {
        const thumbnailFolder = path.join(
          process.cwd(),
          'static',
          'thumbnails',
        );

        const thumbnailFilename = await videoService.generateThumbnailForVideo(
          filePath,
          thumbnailFolder,
        );
        thumbnailUrl =
          'http://' +
          req.hostname +
          ':' +
          process.env.PORT +
          '/rest/static/thumbnails/' +
          thumbnailFilename;
      }

      const mediaFile = await MediaFileModel.create({
        filePath: fileUrl,
        blurhashCode: body.blurhashCode,
        userId: req.userId,
        fileType: type,
        thumbnailPath: thumbnailUrl,
      });

      return res.send(mediaFile.toJSON());
    } catch (e) {
      console.error(e);
      return res.status(500).send({
        error: e,
      });
    }
  };
