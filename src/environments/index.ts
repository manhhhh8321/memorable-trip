import * as dotenv from 'dotenv';
dotenv.config();

const NEED_TO_CONFIGURED = 'NEED TO CONFIGURED';

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'dev';

// application
const SERVER_PORT: number = +process.env.SERVER_PORT || 3000;

// database
const DATABASE_TYPE: string = process.env.DATABASE_TYPE || NEED_TO_CONFIGURED;
const POSTGRES_HOST: string = process.env.POSTGRES_HOST || NEED_TO_CONFIGURED;
const POSTGRES_DATABASE: string = process.env.POSTGRES_DATABASE || NEED_TO_CONFIGURED;
const POSTGRES_USERNAME: string = process.env.POSTGRES_USERNAME || NEED_TO_CONFIGURED;
const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD || NEED_TO_CONFIGURED;
const POSTGRES_PORT: number = +process.env.POSTGRES_PORT || 3306;

//cache query
const CACHE_TYPE: string = process.env.CACHE_TYPE || NEED_TO_CONFIGURED;
const CACHE_HOST: string = process.env.CACHE_HOST || NEED_TO_CONFIGURED;
const CACHE_PORT: number = +process.env.CACHE_PORT || 6379;

// phpmyadmin
const PHPMYADMIN_PORT: number = +process.env.PHPMYADMIN_PORT || 8080;

const SMTP_USERNAME = process.env.SMTP_USERNAME;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_ENDPOINT = process.env.IMAGEKIT_ENDPOINT;

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export {
  NODE_ENV,
  SERVER_PORT,
  POSTGRES_HOST,
  DATABASE_TYPE,
  POSTGRES_DATABASE,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  PHPMYADMIN_PORT,
  CACHE_TYPE,
  CACHE_HOST,
  CACHE_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  IMAGEKIT_ENDPOINT,
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY,
  REDIS_URL,
};
