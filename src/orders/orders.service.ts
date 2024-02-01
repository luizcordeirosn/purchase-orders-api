import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto & { clientId: number }) {
    const productIds = createOrderDto.items.map((item) => item.product_id);
    const uniqueProductIds = [...new Set(productIds)];
    const products = await this.productRepo.findBy({
      id: In(productIds),
    });

    if (products.length !== uniqueProductIds.length) {
      throw new Error(
        `Algum produto não existe. Produto passado ${products.map((product) => product.id)}`,
      );
    }

    const order = Order.create({
      clientId: createOrderDto.clientId,
      items: createOrderDto.items.map((item) => {
        const product = products.find(
          (product) => (product.id = item.product_id),
        );
        return {
          price: product.price,
          productId: item.product_id,
          quantity: item.quantity,
        };
      }),
    });
    const result = this.orderRepo.save(order);

    return result;
  }

  findAll(clientId: number) {
    return this.orderRepo.find({
      where: {
        clientId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: string, clientId: number) {
    return this.orderRepo.findOneByOrFail({
      id,
      clientId,
    });
  }
}
