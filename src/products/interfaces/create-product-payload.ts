import { CreateProductDto } from "../dto/create-product.dto";

/**
 * The payload to create a product
 */
export interface CreateProductPayload {
    // The product's profile image
    image:{
        buffer: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
    }
    // The product's registration information
    createProductDto: CreateProductDto;
}