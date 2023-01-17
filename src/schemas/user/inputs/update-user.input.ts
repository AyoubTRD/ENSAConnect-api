import { Field, InputType } from 'type-graphql';
import { IsEmail, IsPhoneNumber, MinLength } from 'class-validator';
import { User } from '../user.schema';

@InputType()
export class UpdateUserInput implements Partial<User> {
  @IsEmail()
  @Field({ nullable: true })
  email: string;

  @IsPhoneNumber()
  @Field({ nullable: true })
  phoneNumber?: string;

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
  avatarFileId?: string;
}
