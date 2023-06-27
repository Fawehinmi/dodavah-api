import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './users.schema';
import { UsersRepository } from './users.repository';
import { helper } from 'src/helper';
// import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepository) {}

  async create(user: User): Promise<User> {
    user.id = await this.userRepo.generateUserId();
    const user1 = await this.userRepo.findOne({ email: user.email });

    if (user1 != null) {
      throw new HttpException(
        'Email Already Exists',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    try {
      const hashPassword = await helper.hash(user.password);

      const rs = await this.userRepo.create({
        ...user,
        password: hashPassword,
      } as any);

      return rs;
    } catch (error) {}
  }

  async findOne(model: Partial<User>): Promise<User> {
    return this.userRepo.findOne(model);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    if (user.email) {
      const emp = await this.findOne({
        email: new RegExp(`^${user.email}$`, 'i') as any,
      });

      if (emp && emp._id.toString() !== id.toString()) {
        throw new HttpException(
          'Email is already taken',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    }

    if (user.phoneNumber) {
      const emp = await this.findOne({ phoneNumber: user.phoneNumber });

      if (emp && emp._id.toString() !== id.toString()) {
        throw new HttpException(
          'Phone number is already taken',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      user.phoneNumber = helper.removeSpecialChar(user.phoneNumber);
    }

    await this.userRepo.update(id, user);
    return this.findOne({ _id: id } as any);
  }

  findById = async (id: string): Promise<User> => {
    return await this.userRepo.findById(id);
  };
}
