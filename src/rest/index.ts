import { Router, static as expressStatic } from 'express';
import fileUpload from 'express-fileupload';
import { uploadEndpoint } from './routes/upload';

import path from 'path';

const router = Router();

router.use(
  fileUpload({
    createParentPath: true,
    preserveExtension: true,
    safeFileNames: true,
  }),
);
router.use('/static', expressStatic(path.join(process.cwd(), 'static')));

router.post('/upload', uploadEndpoint);

export const restRouter = router;
