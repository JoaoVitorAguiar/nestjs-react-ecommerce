export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
  },
  database: {
    uri:
      process.env.MONGO_URI ??
      (() => {
        throw new Error('MONGO_URI is not defined');
      })(),
  },
  catalog: {
    baseUrl: process.env.CATALOG_API_URL || 'https://dummyjson.com',
  },

  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:5173'],
  },
});
