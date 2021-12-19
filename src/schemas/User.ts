import { ObjectType, Field, InputType, Root } from 'type-graphql';
import {
  DocumentType,
  getModelForClass,
  prop as Property,
} from '@typegoose/typegoose';
import mongoose, { Document } from 'mongoose';
import { IsEmail, MinLength } from 'class-validator';

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

  @Field({ nullable: true })
  @Property({ default: '' })
  avatar: string;

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
