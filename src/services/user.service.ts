import {
  Credentials,
  UpdateUserInput,
  User,
  UserInput,
  UserModel,
} from '../schemas/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
  async getAll(): Promise<User[]> {
    return await UserModel.find();
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
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
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
