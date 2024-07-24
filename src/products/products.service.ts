import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { bucket } from '../firebase-admin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service class for produrcts microservice.
 */
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
    ) { }

    /**
     * Creates a new product for a user.
     * @param id - The id of the user for whom the product is to be created.
     * @param createproductDto - The date to create the product.
     * @param image - The image of the product.
     * @returns A promise that resolves to the created product.
     */
    async create(id: number, createProductDto: CreateProductDto, image: Express.Multer.File) {
        // If there is an image, upload the image to Firebase and get the image URL
        let imageUrl: string = null;
        if (image) {
            imageUrl = await this.uploadImageToFirebase(image);
        }
        // Merge the product data with the image URL and the user id.
        const productData = {
            ...createProductDto,
            imageUrl,
            userId: id,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined
        }

        return await this.productsRepository.save(productData);
    }

    /**
   * Uploads an image to Firebase.
   * @param file - The file to upload to Firebase.
   * @returns The URL of the uploaded file.
   */
    private async uploadImageToFirebase(file: Express.Multer.File): Promise<string> {
        // Generate a random file name to identify the file.
        const fileName = `products/${uuidv4().substring(0, 8)}-${file.originalname}`;
        // Create a file object with the file name.
        const fileUpload = bucket.file(fileName);
        // Save the file to Firebase with the file buffer and metadata.
        await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype },
            public: true,
        });
        // Get the signed URL of the file.
        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-01-2500',
        });

        return url;
    }

    /**
   * Finds all produts method.
   * @returns All products.
   */
    async findAll() {
        return await this.productsRepository.find();
    }

    /**
   * Retrieves all the products for a user.
   * @param id - The id of the user whose products are to be retrieved.
   * @returns 
   */
    async findAllOfSeller(id: number) {
        return await this.productsRepository.find({ where: { userId: id } });
    }

    /**
   * Finds a product by name method.
   * @param userId - The user's id.
   * @param name 
   * @returns The user with the specified id.
   * */
    async findOneByName(userId: number, name: string) {
        return await this.productsRepository.findOne({ where: { userId: userId, name: name } });
    }

    /**
   * Finds a product by id method.
   * @param id - The product's id.
   * @returns The product with the specified id.
   * */
    async findOne(id: number) {
        // Check if the product exists.
        if (isNaN(id)) {
            throw new Error('Invalid product ID');
        }
        return await this.productsRepository.findOneBy({ id });
    }

    /**
   * Updates a product method.
   * @param id - The product's id.
   * @param updateProductDto - The product data to update the product.
   * @param image - The image of the product.
   * @returns The updated product.
   */
    async update(id: number, updateProductDto: UpdateProductDto, image?: Express.Multer.File) {
        // Find the product by id.
        const product = await this.findOne(id);
        // Check if the product exists.
        if (!product) {
            throw new Error('Product not found');
        }
        // If there is an image, upload the image to Firebase and get the image URL
        if (image) {
            const imageUrl = await this.uploadImageToFirebase(image);
            updateProductDto.imageUrl = imageUrl;
        }
        // Avoid updating the id
        const { id: __, ...data } = updateProductDto;
        // Merge the product data with the new data.
        this.productsRepository.merge(product, data);
        return await this.productsRepository.save(product);
    }

    /**
   * Deletes a product method.
   * @param id - The product's id.
   * @returns The result of the deletion operation.
   */
    async remove(id: number) {
        return await this.productsRepository.softDelete(id);
    }
}
