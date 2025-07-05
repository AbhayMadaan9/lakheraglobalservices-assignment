import { Sequelize } from 'sequelize';
import dbConfig from '../config/config';
import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

let sequelize: Sequelize;

if ('use_env_variable' in config && config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, {
    dialect: config.dialect,
  });
} else {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export default sequelize;
