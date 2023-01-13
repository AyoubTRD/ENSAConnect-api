import { MediaFile, MediaFileModel } from '../schemas/file/mediafile.schema';
import { DbDocument } from '../types/DbDocument';

export class MediaFileService {
  async getMediaFileById(id: string): Promise<DbDocument<MediaFile> | null> {
    const mediaFile = await MediaFileModel.findById(id);
    return mediaFile;
  }

  async getMediaFilesByIds(ids: string[]): Promise<DbDocument<MediaFile>[]> {
    return MediaFileModel.find({ _id: { $in: ids } });
  }
}
