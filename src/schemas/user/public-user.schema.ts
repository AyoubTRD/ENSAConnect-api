import { Field, ObjectType } from 'type-graphql';
import { User } from './user.schema';

@ObjectType()
export class PublicUser implements Partial<Omit<User, 'getSelf'>> {
  readonly _id: string;

  @Field()
  get id(): string {
    const self = this.getSelf();
    return self._id;
  }

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  createdAt: Date;

  @Field()
  get fullName(): string {
    const self = this.getSelf();
    return self.firstName + ' ' + self.lastName;
  }

  getSelf(): PublicUser {
    if (this._id) return this;
    return (this as any)._doc;
  }
}
