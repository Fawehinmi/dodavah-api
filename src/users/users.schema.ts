import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRoleTypes {
  SuperAdmin = 'SuperAdmin',
  Member = 'Member',
}

@Schema()
export class User {
  _id: Types.ObjectId;
  @Prop()
  id: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  age: number;
  @Prop()
  active: boolean;
  @Prop()
  roles: [string];
}

export class ChangePassword {
  oldPassword: string;
  newPassword: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
