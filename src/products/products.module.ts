import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Products])],
    controllers: [ProductsController],
    providers: [ProductService],
})
export class ProductsModule { }