import { registerEnumType } from 'type-graphql';

export enum MediaFileType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'pdf',
  OTHER = 'other',
}

registerEnumType(MediaFileType, {
  name: 'MediaFileType',
  description: 'The types of media files',
});
