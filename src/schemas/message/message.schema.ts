import { Field, ObjectType } from 'type-graphql';
import { getModelForClass, prop as Property, Ref } from '@typegoose/typegoose';
import { MediaFile } from '../file/mediafile.schema';
import { User } from '../user/user.schema';
import { Chat } from '../chat/chat.schema';

@ObjectType()
export class Message {
  readonly _id: string;

  getSelf(): Message {
    if (this._id) return this;
    return (this as any)._doc;
  }

  @Field()
  get id(): string {
    return this.getSelf()._id;
  }

  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;

  @Field()
  @Property({ type: String, default: '' })
  text: string;

  @Field(() => [String])
  @Property({ default: [], ref: MediaFile })
  fileIds: Ref<MediaFile>[];

  @Field(() => String)
  @Property({ ref: User, required: true })
  userId: Ref<User>;

  @Field(() => String)
  @Property({ ref: Chat, required: true })
  chatId: Ref<Chat>;
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: {
    timestamps: true,
  },
});
