import Ffmpeg from 'fluent-ffmpeg';

export class VideoService {
  generateThumbnailForVideo(
    pathToVideo: string,
    folderToSaveThumbnail: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      Ffmpeg(pathToVideo)
        .on('filenames', (filenames: string[]) => resolve(filenames[0]))
        .on('error', (error) => reject(error))
        .takeScreenshots(
          {
            count: 1,
            timemarks: ['0'],
          },
          folderToSaveThumbnail,
        );
    });
  }
}
