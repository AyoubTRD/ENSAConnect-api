import { ObjectType, Field, InputType } from 'type-graphql';
import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import mongoose from 'mongoose';

@ObjectType()
export class User {
  @Field()
  readonly _id: string;

  @Field()
  @Property({ required: true, unique: true })
  email: string;

  @Field()
  @Property({ required: true })
  firstName: string;

  @Field()
  @Property({ required: true })
  lastName: string;

  @Field()
  @Property({ default: '' })
  avatar: string;

  @Property({ required: true })
  password: string;

  @Property({ default: [], type: String })
  tokens: mongoose.Types.Array<string>;
}

@ObjectType()
export class AuthResult {
  @Field()
  token: string;

  @Field()
  user: User;
}

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;

  @Field()
  avatar: string;
}

@InputType()
export class Credentials {
  @Field()
  email: string;

  @Field()
  password: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});
