module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  MONGODB_URL: process.env.MONGODB_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  email: {
    account: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};
