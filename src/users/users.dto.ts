import {
  Field,
  InputType,
  ObjectType,
  ID,
  registerEnumType,
} from '@nestjs/graphql';
import { UserRoleTypes } from './users.schema';

registerEnumType(UserRoleTypes, {
  name: 'UserRoleTypes',
});

@ObjectType()
export class User {
  @Field((type) => ID)
  _id: string;
  @Field()
  id: string;
  @Field()
  firstName: string;
  @Field((type) => String, { nullable: true })
  lastName: string;
  @Field((type) => String, { nullable: true })
  fullName: string;
  @Field((type) => String, { nullable: true })
  otherName: string;
  @Field((type) => String, { nullable: true })
  email: string;
  @Field((type) => String, { nullable: true })
  phoneNumber: string;
  @Field((type) => [UserRoleTypes])
  roles: Array<UserRoleTypes>;
  @Field((type) => String, { nullable: true })
  address: string;
}

@InputType()
export class UpdateUserInput {
  @Field((type) => String, { nullable: true })
  firstName: string;
  @Field((type) => String, { nullable: true })
  lastName: string;
  @Field((type) => String, { nullable: true })
  otherName: string;
  @Field((type) => String, { nullable: true })
  email: string;
  @Field((type) => String, { nullable: true })
  username: string;
  @Field((type) => String, { nullable: true })
  phoneNumber: string;
}
