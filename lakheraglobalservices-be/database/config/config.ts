import * as dotenv from 'dotenv';
import path from 'path';


const myEnv = process.env.NODE_ENV || 'development';

const envFilePath = path.resolve(__dirname, `./.env.${myEnv}`);
console.log('process.env.DATABASE_URL: ', process.env.DATABASE_URL);
const config = {
  local: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  development: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
} as Record<string, any>;

export = config;
