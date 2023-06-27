import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

@ObjectType()
export class ProductImage {
  @Field((type) => String, { nullable: true })
  _id: string;
  @Field((type) => String, { nullable: true })
  uri: string;
  @Field((type) => String, { nullable: true })
  name: string;
  @Field((type) => String, { nullable: true })
  type: string;
  // @Field((type) => String, { nullable: true })
  // cover: boolean;
}

@InputType()
export class ProductImageInput {
  @Field()
  base64Str: string;
  @Field()
  filename: string;
  @Field()
  filetype: string;
  // @Field()
  // cover: boolean;
}

@ObjectType()
export class Product {
  @Field((type) => ID)
  _id?: string | any;
  @Field((type) => String, { nullable: true })
  name: string;
  @Field((type) => String, { nullable: true })
  detail: string;
  @Field((type) => Number, { nullable: true })
  priceBefore: number;
  @Field((type) => Number, { nullable: true })
  price: number;
  @Field((type) => Number, { nullable: true })
  quantity: number;
  @Field((type) => String, { nullable: true })
  category: string;
  @Field((type) => ID, { nullable: true })
  categoryId: string;
  @Field((type) => Number, { nullable: true })
  createdAt: number;
  @Field((type) => Number, { nullable: true })
  updatedAt: number;
  @Field((type) => [ProductImage], { nullable: true })
  images: Array<ProductImage>;
}

@InputType()
export class ProductCommonInput {
  @Field((type) => String)
  name: string;
  @Field((type) => String)
  detail: string;
  @Field((type) => Number)
  price: number;
  @Field((type) => Number, { nullable: true })
  priceBefore: number;
  @Field((type) => Number)
  quantity: number;
  @Field((type) => [ProductImageInput], { nullable: true })
  files: [ProductImageInput];
  @Field((type) => ID, { nullable: true })
  categoryId: string;
  @Field((type) => ID, { nullable: true })
  category: string;
}

@InputType()
export class CreateProductInput extends ProductCommonInput {}

@InputType()
export class UpdateProductInput extends ProductCommonInput {}

@InputType()
export class ProductPageInput {
  @Field((type) => Number, { nullable: false })
  skip: number;
  @Field((type) => Number, { nullable: false })
  take: number;
  @Field((type) => String, { nullable: true })
  keyword: string;
  @Field((type) => String, { nullable: true })
  status: string;
  @Field((type) => String, { nullable: true })
  categoryId: string;
}
@ObjectType()
export class ProductPageResult {
  @Field((type) => Number, { nullable: false })
  totalRecords: number;
  @Field((type) => [Product])
  data: [Product];
}
