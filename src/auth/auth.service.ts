import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { ChangePassword, User, UserRoleTypes } from 'src/users/users.schema';
import { ApolloError } from 'apollo-server-express';
import { Roles } from './decorators';
import { Role } from 'src/enum';
import { helper } from 'src/helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersSvc: UsersService,
    private readonly jwtSvc: JwtService,
  ) {}

  async _confirmRoles(
    user: User,
    client: 'Admin' | 'Member',
  ): Promise<boolean> {
    return user.roles[0].includes(client);
  }

  async validateUser(
    email: string,
    pass: string,
    client: 'Admin' | 'Member',
  ): Promise<User> {
    const user = await this.usersSvc.findOne({ email });

    if (!user) throw new ApolloError('Invalid username or password');

    const userPassCorrect = await bcrypt.compare(pass, user.password);
    if (userPassCorrect && (await this._confirmRoles(user, client))) {
      delete user.password;
      return user;
    } else {
      throw new ApolloError('Invalid username or password');
    }
  }
  phoneSignup = async (user: User): Promise<User> => {
    return this.usersSvc.create({
      ...user,
      roles: [UserRoleTypes.Member],
    });
  };
  async login(user: any) {
    const userValidated = await this.validateUser(
      user.email,
      user.password,
      user.client,
    );

    if (userValidated) {
      const token = this.jwtSvc.sign(
        {
          _id: userValidated._id,
          email: userValidated.email,
          roles: userValidated.roles,
          name: `${userValidated.firstName} ${userValidated.lastName} `,
        },
        {
          secret: process.env.jwt_secret,
          expiresIn: process.env.TOKEN_EXPIRES_IN,
        },
      );
      return {
        token: token,
        roles: userValidated.roles,
        userId: userValidated._id,
        userValidatedName: userValidated.name,
        phoneNumber: userValidated.phoneNumber,

        // tokenExpiresIn: this.configSvc.get("jwt.tokenTimeSpan"),
        name: `${userValidated.firstName} ${userValidated.lastName}`,
      };
    }
  }

  changePassword = async (
    password: ChangePassword,
    userId: string,
  ): Promise<string> => {
    const user = await this.usersSvc.findOne({
      _id: userId,
    } as any);

    const isMatch = await bcrypt.compare(password.oldPassword, user.password);

    if (!isMatch) throw new ApolloError('Invalid password');

    const hashedPassword = await helper.hash(password.newPassword);

    await this.usersSvc.update(user._id.toString(), {
      password: hashedPassword,
    });

    return 'Password changed';
  };
  user = async (userId) => {
    return await this.usersSvc.findOne({ _id: userId });
  };
}
