import { UpdateProductDto } from "../dto/update-product.dto"; 

/**
 * The payload to update a product
 */
export interface UpdateProductPayload {
    // The product's profile image
    image:{
        buffer: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
    }
    // The product's updated information
    updateProductDto: UpdateProductDto;
}