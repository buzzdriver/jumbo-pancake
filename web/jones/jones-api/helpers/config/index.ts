import devConfig from "./development";
import prodConfig from "./production";
import previewConfig from "./preview";

interface Config {
  env: string;
  apiUrl: string;
}

let config: Config;

switch (process.env["VERCEL_ENV"]) {
  case "development":
    config = devConfig;
    break;
  case "preview":
    config = previewConfig;
    break;
  default:
    config = prodConfig;
    break;
}

export default config;
