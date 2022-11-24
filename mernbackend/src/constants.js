module.exports = Object.freeze({
  SECRET_KEY: process.env.SECRET_KEY || require("crypto").randomBytes(32),
  PORT: process.env.PORT || 3000,
});
