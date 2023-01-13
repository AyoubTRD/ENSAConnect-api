import { Resolver } from 'type-graphql';
import { MediaFile } from '../schemas/file/mediafile.schema';

@Resolver((of) => MediaFile)
export class MediaFileResolver {}
