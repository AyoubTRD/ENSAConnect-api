import { ObjectType, Field } from 'type-graphql';
import {
  getModelForClass,
  prop as Property,
  post,
  plugin,
  Ref,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import moment from 'moment';
import { MediaFile } from '../file/mediafile.schema';

@post<User>('remove', async function () {
  console.log(this);
  // Delete the posts created by this user
})
@ObjectType()
export class User {
  readonly _id: string;

  @Field()
  get id(): string {
    const self = this.getSelf();
    return self._id;
  }

  @Field()
  @Property({ required: true, unique: true })
  email: string;

  @Field()
  @Property({ required: true })
  firstName: string;

  @Field()
  @Property({ required: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  @Property({ ref: MediaFile })
  avatarFileId?: Ref<MediaFile>;

  @Field({ nullable: true })
  @Property()
  lastUpdatedName?: Date;

  @Field({ nullable: true })
  @Property()
  phoneNumber?: string;

  @Property({ required: true })
  password: string;

  @Property({ default: [], type: String })
  tokens: mongoose.Types.Array<string>;

  @Field()
  createdAt: Date;

  @Field()
  get fullName(): string {
    const self = this.getSelf();
    return self.firstName + ' ' + self.lastName;
  }

  @Field()
  get canUpdateName(): boolean {
    const self = this.getSelf();

    if (!self.lastUpdatedName) return true;

    return moment().diff(self.lastUpdatedName, 'months') >= 1;
  }

  getSelf(): User {
    if (this._id) return this;
    return (this as any)._doc;
  }
}

@ObjectType()
export class AuthResult {
  @Field()
  token: string;

  @Field()
  user: User;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
  options: {},
});
