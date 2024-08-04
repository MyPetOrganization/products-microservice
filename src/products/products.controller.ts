import { Controller, ParseIntPipe } from "@nestjs/common";
import { ProductService } from "./products.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateProductPayload } from "./interfaces/create-product-payload";
import { Readable } from 'stream';
import { UpdateProductPayload } from "./interfaces/update-product-payload";
import { GetOneProductPayload } from "./interfaces/get-one-product-payload";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductService) { }

    /**
   * Creates a new product.
   * @param payload - The payload to create a product.
   * @returns The created product.
   */
    @MessagePattern({ cmd: 'create_product' })
    async create(
        @Payload() payload: CreateProductPayload
    ) {
        const id = payload.createProductDto.userId;
        // The image of the product
        const image = payload.image;
        // The product data to create the product
        const createProductDto = payload.createProductDto;
        let file: Express.Multer.File = null;
        // If there is an image, create a file object from the image to be used in the service
        if (image) {
            const imageBuffer = Buffer.from(image.buffer, 'base64');
            file = {
                buffer: imageBuffer,
                originalname: image.originalname,
                encoding: image.encoding,
                mimetype: image.mimetype,
                size: image.size,
                fieldname: '',
                stream: new Readable,
                destination: '',
                filename: '',
                path: ''
            };
        }
        return await this.productsService.create(id, createProductDto, file);
    }

    /**
   * Finds all products.
   * @returns List of all products.
   */
    @MessagePattern({ cmd: 'get_all_products' })
    async findAll() {
        return await this.productsService.findAll();
    }

    /**
   * Finds all products of a user.
   * @param userId - The id of the user.
   * @returns List of seller products.
   */
    @MessagePattern({ cmd: 'get_all_seller_products' })
    async findAllOfSeller(@Payload('id', ParseIntPipe) userId: number) {
        return await this.productsService.findAllOfSeller(userId);
    }

    /**
     * Finds a product by its name.
     * @param payload - The payload to find a product by its name.
     * @returns The product.
    */
    @MessagePattern({ cmd: 'get_by_name' })
    async findOneByName(@Payload() payload: GetOneProductPayload,) {
        // The id of the user
        const userId = payload.id;
        // The name of the product
        const name = payload.name;
        return await this.productsService.findOneByName(userId, name);
    }

    /**
   * Updates a product.
   * @param payload - The payload to update a product.
   * @returns The updated product.
   */
    @MessagePattern({ cmd: 'update_product' })
    async update(
        @Payload() payload: UpdateProductPayload,
    ) {
        // The image of the product
        const image = payload.image;
        // The product data to update the product
        const updateProductDto = payload.updateProductDto;
        // The id of the user to update
        const id = payload.updateProductDto.id;
        let file: Express.Multer.File
        // If there is an image, create a file object from the image to be used in the service
        if (image) {
            const imageBuffer = Buffer.from(image.buffer, 'base64');
            file = {
                buffer: imageBuffer,
                originalname: image.originalname,
                encoding: image.encoding,
                mimetype: image.mimetype,
                size: image.size,
                fieldname: '',
                stream: new Readable,
                destination: '',
                filename: '',
                path: ''
            };
        }

        return await this.productsService.update(id, updateProductDto, file);
    }

    /**
   * Deletes a product.
   * @param id - The product's id
   * @returns The result of the deletion operation.
   */
    @MessagePattern({ cmd: 'delete_product' })
    async remove(@Payload('id', ParseIntPipe) productId: number) {
        return await this.productsService.remove(+productId);
    }

}