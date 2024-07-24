import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Represents a product entity in the system.
*/
@Entity('products')
export class Products {
    /**
     * The unique identifier of the product.
     * @example 1
    */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The name of the product.
     * @example Dog Food
    */
    @Column({nullable: false})
    public name: string;
    
    /**
     * The price of the product.
     * @example 10.99
    */
    @Column({nullable: false, type: 'decimal', precision: 10, scale: 2})
    public price: number;

    /**
     * The URL of the product image.
     * @example https://example.com/product.jpg
    */
    @Column({nullable: false})
    public imageUrl: string;

    /**
     * The user ID of the user who created the product.
     * @example 1
    */
    @Column({ nullable: false })
    public userId: number;

    /**
     * The date and time the user was created.
     * @example 2021-06-01T12:00:00.000Z
     */
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    public createdAt: Date;

    /**
     * The date and time the user was last updated.
     * @example 2021-06-01T12:00:00.000Z
     */
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    public updatedAt: Date;

    /**
     * The date and time the user was deleted.
     * @example 2021-06-01T12:00:00.000Z
    */
    @DeleteDateColumn()
    public deletedAt: Date;
}