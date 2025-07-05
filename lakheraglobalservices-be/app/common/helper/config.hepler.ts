import dotenv from "dotenv";
import process from "process";
import path from "path";

export const loadConfig = () => {
  const env = process.env.NODE_ENV ?? "local";
  const filepath = path.join(process.cwd(), `.env.${env}`);
  console.log('filepath: ', filepath);
  dotenv.config({ path: filepath });
};
