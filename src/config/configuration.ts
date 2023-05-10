export default () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  bcrypt: {
    salt: process.env.BCRYPT_SALT,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    atkExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    rtkExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
  oauth: {
    googleClientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
  },
});
