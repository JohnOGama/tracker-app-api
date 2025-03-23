import { registerAs } from '@nestjs/config';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = {
  type: 'postgres',
  host: process.env.HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  autoLoadEntities: true,
  synchronize: true,
};
export default registerAs('typeormConfig', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
