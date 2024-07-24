/**
 * Payload for getting one product.
 */
export interface GetOneProductPayload {
    // The id of the user who owns the product.
    id: number;
    // The name of the product to retrieve.
    name: string;
}