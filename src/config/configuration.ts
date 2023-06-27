export default () => ({
  port: parseInt(process.env.PORT, 10) || 4001,
  database: {
    host: `mongodb+srv://dodavah:${process.env.DATABASE_PASSWORD}@dodavah.6ju8ggr.mongodb.net/?retryWrites=true&w=majority`,
    port: parseInt(process.env.DATABASE_PORT, 10) || 4001,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    // tokenTimeSpan: Number(process.env.jwt_token_timespan),
  },
  crypto: {
    secret: process.env.crypto_secret,
  },
  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET,
  },
  paystack: {
    key: process.env.PAYSTACK_TEST_SECRET_KEY,
  },
});

