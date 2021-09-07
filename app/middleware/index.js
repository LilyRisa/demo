const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyFogotPassword = require('./checkTokenFogot');

module.exports = {
  authJwt,
  verifySignUp,
  verifyFogotPassword
};