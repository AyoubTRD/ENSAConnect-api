import { getModelForClass, prop as Property, Ref } from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';
import { User } from '../user/user.schema';
import { MediaFileType } from './enums/mediafile-type.enum';

@ObjectType()
export class MediaFile {
  readonly _id: string;

  @Field()
  get id(): string {
    return this.getSelf()._id;
  }

  getSelf(): MediaFile {
    if (this._id) return this;
    return (this as any)._doc;
  }

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Property({ ref: User, required: true })
  @Field(() => String)
  userId: Ref<User>;

  @Property({ type: String, default: MediaFileType.OTHER })
  @Field((type) => MediaFileType)
  fileType: MediaFileType;

  @Property({ required: true })
  @Field(() => String)
  filePath: string;

  @Property()
  @Field({ nullable: true })
  blurhashCode?: string;

  @Property()
  @Field({ nullable: true })
  thumbnailPath?: string;
}

export const MediaFileModel = getModelForClass(MediaFile, {
  schemaOptions: {
    timestamps: true,
  },
});
