import {
  getModelForClass,
  mongoose,
  prop as Property,
  Ref,
} from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';

import { User } from '../user/user.schema';

@ObjectType()
export class Post {
  readonly _id: string;

  @Field()
  get id(): string {
    const self = this.getSelf();
    return self._id;
  }

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Property({ ref: User })
  authorId: Ref<User>;

  @Property()
  @Field()
  text: string;

  @Property({ default: [], type: [String] })
  @Field((returns) => [String])
  files: string[];

  getSelf(): Post {
    if (this._id) return this;
    return (this as any)._doc;
  }
}

export const PostModel = getModelForClass(Post, {
  schemaOptions: {
    timestamps: true,
  },
});
