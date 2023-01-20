import { Field, ObjectType } from 'type-graphql';
import { getModelForClass, prop as Property, Ref } from '@typegoose/typegoose';
import { User } from '../user/user.schema';

@ObjectType()
export class Chat {
  readonly _id: string;

  getSelf(): Chat {
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

  @Property({ ref: User })
  @Field(() => [String])
  userIds: Ref<User>[];

  @Property({ type: String })
  @Field({ nullable: true })
  name?: string;
}

export const ChatModel = getModelForClass(Chat, {
  schemaOptions: {
    timestamps: true,
  },
});
