import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { CartRepository } from './cart.repository';
import { CartItem, UserCart } from './cart.schema';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly productSvc: ProductService,
  ) {}

  public addItem = async (model: CartItem): Promise<UserCart> => {
    let item = await this.cartRepo.findOne({
      userId: new Types.ObjectId(model.userId),
      productId: new Types.ObjectId(model.productId),
    });
    if (item) {
      const rs = await this.findUserCart(item.userId.toString());
      return rs;
    }

    const product = await this.productSvc.findById(model.productId as any);

    if (!product) throw new Error('Product Unavailable');

    const rs = await this.cartRepo.create({
      ...model,
      _id: new Types.ObjectId(),
    });

    return await this.findUserCart(rs?.userId.toString());
  };

  public updateItem = async (
    _id: string,
    userId: string,
    model: CartItem,
  ): Promise<UserCart> => {
    await this.cartRepo.update(_id, {
      quantity: model.quantity,
    } as any);

    return await this.findUserCart(userId);
  };

  public deleteItem = async (id: string): Promise<UserCart> => {
    const item = await this.cartRepo.findOne({ _id: id } as any);
    await this.cartRepo.delete(id);
    return await this.findUserCart(item.userId.toString());
  };

  public clearItems = async (item: Partial<CartItem>): Promise<UserCart> => {
    await this.cartRepo.clear(item);
    return await this.findUserCart(item.userId.toString());
  };

  public clearCart = async (id: string): Promise<Boolean> => {
    await this.cartRepo.clear({ userId: new Types.ObjectId(id) });
    return true;
  };

  public findUserCart = async (userId: string): Promise<any> => {
    const rs = await this.cartRepo.findUserCart({
      userId: userId,
    } as any);

    const items = await Promise.all(
      rs.items.map(async (item) => {
        const product = await this.productSvc.findById(item.productId as any);
        return {
          ...item,
          totalAmount: item.quantity * product.price,
          price: product.price,
          product,
        };
      }),
    );

    const totalAmount = items
      .map((item) => +item.quantity * +item?.product?.price)
      .reduce((a, b) => a + b, 0);

    const tax = totalAmount * 0.03;
    return {
      items,
      subTotal: totalAmount,
      totalPrice: totalAmount + tax,
      tax,
    };
  };
}
