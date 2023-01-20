import { Field, InputType } from 'type-graphql';
import { IsEmail, MinLength } from 'class-validator';
import { User } from '../user.schema';

@InputType()
export class CreateUserInput implements Partial<User> {
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
}
