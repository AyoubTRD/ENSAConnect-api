import { ObjectType, Field, InputType } from 'type-graphql';
import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { IsEmail, MinLength } from 'class-validator';

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

  @Field({ nullable: true })
  @Property({ default: '' })
  avatar: string;

  @Property({ required: true })
  password: string;

  @Property({ default: [], type: String })
  tokens: mongoose.Types.Array<string>;

  @Field()
  get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }
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
  @IsEmail()
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @MinLength(6)
  @Field()
  password: string;

  @Field()
  avatar: string;
}

@InputType()
export class UpdateUserInput implements Partial<User> {
  @IsEmail()
  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @MinLength(6)
  @Field({ nullable: true })
  password: string;

  @MinLength(6)
  @Field({ nullable: true })
  oldPassword: string;

  @Field({ nullable: true })
  avatar: string;
}

@InputType()
export class Credentials implements Partial<User> {
  @IsEmail()
  @Field()
  email: string;

  @MinLength(6)
  @Field()
  password: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});
