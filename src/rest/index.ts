import { Router, static as expressStatic } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import bodyParser from 'body-parser';

import { uploadRoute } from './routes/upload';
import { restAuthorized } from '../middlewares/rest-authorized';
import { MediaFileType } from '../schemas/file/enums/mediafile-type.enum';

const router = Router();

router.use(bodyParser.json());
router.use(
  fileUpload({
    createParentPath: true,
    preserveExtension: true,
    safeFileNames: true,
  }),
);
router.use('/static', expressStatic(path.join(process.cwd(), 'static')));

router.post('/upload-image', restAuthorized, uploadRoute(MediaFileType.IMAGE));
router.post('/upload-video', restAuthorized, uploadRoute(MediaFileType.VIDEO));
router.post(
  '/upload-document',
  restAuthorized,
  uploadRoute(MediaFileType.DOCUMENT),
);
router.post('/upload-other', restAuthorized, uploadRoute(MediaFileType.OTHER));

export const restRouter = router;
