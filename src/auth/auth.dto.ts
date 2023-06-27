import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Role } from 'src/enum';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class Auth {
  @Field()
  userId: string;
  @Field()
  name: string;
  @Field()
  token: string;
  @Field((type) => [Role])
  roles: Array<Role>;

  @Field()
  phoneNumber: string;
  // @Field()
  // tokenExpiresIn: number;
}

@InputType()
export class PhoneSignUpInput {
  @Field((type) => String)
  firstName: string;
  @Field((type) => String)
  lastName: string;
  @Field((type) => String)
  phoneNumber: string;
  @Field((type) => String)
  password: string;
  @Field((type) => String)
  username: string;
  @Field((type) => String)
  email: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  oldPassword: string;
  @Field()
  newPassword: string;
}
