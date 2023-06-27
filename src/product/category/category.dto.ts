import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CategoryStatusTypes } from './category.schema';

registerEnumType(CategoryStatusTypes, {
  name: 'CategoryStatusTypes',
});

@ObjectType()
export class CategoryImage {
  @Field((type) => String, { nullable: true })
  _id: string;
  @Field((type) => String, { nullable: true })
  uri: string;
}

@InputType()
export class CategoryImageInput {
  @Field()
  base64Str: string;
  @Field({nullable: true})
  filename: string;
  @Field({nullable: true})
  filetype: string;
}
@ObjectType()
export class ProductCategory {
  @Field((type) => ID)
  _id?: string;
  @Field((type) => String)
  name: string;
  @Field((type) => CategoryImage, { nullable: true })
  image: CategoryImage;
}

@InputType()
export class CommonProductCategoryInput {
  @Field()
  name: string;

  @Field((type) => CategoryImageInput, { nullable: true })
  file: CategoryImageInput;
}

@InputType()
export class CreateProductCategoryInput extends CommonProductCategoryInput {}

@InputType()
export class UpdateProductCategoryInput extends CommonProductCategoryInput {}

@InputType()
export class ProductCategoryQueryInput {
  @Field()
  name: String;
}

@InputType()
export class ProductCategoryPageInput {
  @Field((type) => Number, { nullable: false })
  skip: number;
  @Field((type) => Number, { nullable: false })
  take: number;
  @Field((type) => String, { nullable: true })
  keyword: string;
  // @Field((type) => String, { nullable: true })
  // status: string;
}

@ObjectType()
export class ProductCategoryPageResult {
  @Field((type) => Number, { nullable: false })
  totalRecords: number;
  @Field((type) => [ProductCategory])
  data: [ProductCategory];
}
