// In this file we should populate all environemnt variables to the config,
// so we don't need to call process.env.VARIABLE_NAME from any other place
//
// https://docs.nestjs.com/techniques/configuration

export interface Configuration {
  app_name: string;
  node_env: string;
  port: number;
  usda_api_key: string;
}
export default (): Configuration => ({
  port: Number(process.env.PORT || 3000),
  node_env: process.env.NODE_ENV || 'local',
  app_name: process.env.APP_NAME || 'food-calculator',
  usda_api_key: process.env.USDA_API_KEY,
});
