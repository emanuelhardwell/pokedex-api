export const envConfig = () => ({
  env: process.env.ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 4000,
  defaultLimit: +process.env.DEFAULT_LIMIT || 7, // se agrega + para volver numero el string "number" ejemplo : "7"
});
