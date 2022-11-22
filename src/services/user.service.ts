import {
  Credentials,
  UpdateUserInput,
  User,
  UserInput,
  UserModel,
} from '../schemas/user.schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { GraphQLError } from 'graphql';

export class UserService {
  async getAll(): Promise<User[]> {
    return await UserModel.find();
  }

  async getUserById(id: string): Promise<User> {
    return await UserModel.findById(id);
  }

  async deleteToken({
    token,
    id,
  }: {
    token: string;
    id: string;
  }): Promise<void> {
    const user = await UserModel.findById(id);
    user.tokens.splice(user.tokens.indexOf(token), 1);
    await user.save();
  }

  async deleteUser({ id }: { id: string }): Promise<void> {
    await UserModel.deleteOne({ _id: id });
  }

  async createUser({
    email,
    firstName,
    lastName,
    avatar,
    password,
  }: UserInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      email: email.toLowerCase(),
      avatar,
      firstName,
      lastName,
      password: hashedPassword,
    });
    return user;
  }

  async generateTokenForUser({ id }: { id: string }): Promise<[string, User]> {
    const user = await UserModel.findById(id);
    const token = jwt.sign({ _id: id }, process.env.JWT_KEY);
    user.tokens.push(token);
    await user.save();
    return [token, user];
  }

  async updateUser(
    id: string,
    {
      email,
      phoneNumber,
      firstName,
      lastName,
      avatar,
      oldPassword,
      password,
    }: UpdateUserInput,
  ): Promise<User> {
    const user = await UserModel.findById(id);
    if (password) {
      const oldPasswordIsValid = await bcrypt.compare(
        oldPassword,
        user.password,
      );
      if (!oldPasswordIsValid) throw new Error('wrong_password');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (email) {
      const userWithSameEmail = await UserModel.findOne({ email });
      if (userWithSameEmail) throw new Error('email_taken');
      user.email = email;
    }
    if (typeof avatar === 'string') user.avatar = avatar;
    if (firstName || lastName) {
      if (
        user.lastUpdatedName &&
        moment().diff(user.lastUpdatedName, 'months') < 1
      ) {
        throw new GraphQLError(
          'You do not yet have permission to update your name, you will be able to update it starting from: ' +
            moment(user.lastUpdatedName)
              .add(1, 'months')
              .toDate()
              .toISOString(),
        );
      }
      user.lastUpdatedName = new Date();
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    await user.save();
    return user;
  }

  async getUserWithCredentials({
    email,
    password,
  }: Credentials): Promise<User> {
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (!user) throw new Error('wrong_email');
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) throw new Error('wrong_password');
    return user;
  }
}
