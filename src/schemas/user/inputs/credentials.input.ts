import { Field, InputType } from 'type-graphql';
import { IsEmail, MinLength } from 'class-validator';
import { User } from '../user.schema';

@InputType()
export class CredentialsInput implements Partial<User> {
  @IsEmail()
  @Field()
  email: string;

  @MinLength(6)
  @Field()
  password: string;
}
