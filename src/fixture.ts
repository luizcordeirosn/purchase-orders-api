import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const dataSource = app.get<DataSource>(getDataSourceToken());
  await dataSource.synchronize(true);

  const productRepo = dataSource.getRepository('Product');
  await productRepo.insert([
    {
      id: 'd73a625e-b0a7-418c-bdff-76e8864c536f',
      name: 'Product 1',
      description: 'Product 1 description',
      imageUrl: 'http://via.placeholder.com/150',
      price: 100.0,
    },
    {
      id: 'cc37f645-4750-4229-bc1a-39e50d54e46e',
      name: 'Product 2',
      description: 'Product 2 description',
      imageUrl: 'http://via.placeholder.com/150',
      price: 200.0,
    },
    {
      id: '4d7e1c61-9f83-47d9-828a-263227719d14',
      name: 'Product 3',
      description: 'Product 3 description',
      imageUrl: 'http://via.placeholder.com/150',
      price: 300.0,
    },
  ]);

  await app.close();
}
bootstrap();
