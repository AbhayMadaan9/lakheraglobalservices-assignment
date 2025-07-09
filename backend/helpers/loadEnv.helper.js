const dotenv = require("dotenv");
const process = require("process");
const path = require("path");

const loadEnv = () => {
  const env = process.env.NODE_ENV ?? "development";
  const filepath = path.join(process.cwd(), `.env.${env}`);
  dotenv.config({ path: filepath });
};

module.exports = {
  loadEnv,
};
