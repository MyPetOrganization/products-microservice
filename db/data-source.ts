import {DataSource, DataSourceOptions} from 'typeorm'
import {config} from 'dotenv'
import { Products } from 'src/products/entities/products.entity';
config()
export const dataSourceOptions:DataSourceOptions={
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Products],
    migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
    logging: true,
    synchronize: false,
    ssl: false,
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
