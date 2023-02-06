import * as dotenv from 'dotenv';
dotenv.config();

const NEED_TO_CONFIGURED = 'NEED TO CONFIGURED';

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'dev';

// application
const SERVER_PORT: number = +process.env.SERVER_PORT || 3000;

// database
const DATABASE_TYPE: string = process.env.DATABASE_TYPE || NEED_TO_CONFIGURED;
const DATABASE_HOST: string = process.env.DATABASE_HOST || NEED_TO_CONFIGURED;
const MYSQL_DATABASE: string = process.env.MYSQL_DATABASE || NEED_TO_CONFIGURED;
const MYSQL_USER: string = process.env.MYSQL_USER || NEED_TO_CONFIGURED;
const MYSQL_PASSWORD: string = process.env.MYSQL_PASSWORD || NEED_TO_CONFIGURED;
const MYSQL_PORT: number = +process.env.MYSQL_PORT || 3306;
//cache query
const CACHE_TYPE: string = process.env.CACHE_TYPE || NEED_TO_CONFIGURED;
const CACHE_HOST: string = process.env.CACHE_HOST || NEED_TO_CONFIGURED;
const CACHE_PORT: number = +process.env.CACHE_PORT || 6379;

// phpmyadmin
const PHPMYADMIN_PORT: number = +process.env.PHPMYADMIN_PORT || 8080;

export {
  NODE_ENV,
  SERVER_PORT,
  DATABASE_HOST,
  DATABASE_TYPE,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  PHPMYADMIN_PORT,
  CACHE_TYPE,
  CACHE_HOST,
  CACHE_PORT,
};
