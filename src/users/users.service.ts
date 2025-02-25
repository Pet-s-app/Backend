import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserDTO } from './dto/user';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
  }

  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }) ?? null;
  }

  async create(user: UserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new this.userModel({ ...user, password: hashedPassword, refreshToken: null });
    return await newUser.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: User[];
    page: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const total = await this.userModel.countDocuments();
    const data = await this.userModel.find().skip(skip).limit(limit).exec();
    return {
      data,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }


  async deleteAll(): Promise<void> {
    await this.userModel.deleteMany();
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    user.refreshToken = refreshToken;
    return user;
  }

  async updatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    user.password = await bcrypt.hash(password, 10);
    return user;
  }

  async logout(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    user.refreshToken = null;
    return true;
  }
}
