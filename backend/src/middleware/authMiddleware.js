// backend/middleware/authMiddleware.js

const {expressjwt: jwt} = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Middleware to validate the token
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-04280sry4r60xnlk.us.auth0.com/.well-known/jwks.json`,
  }),

  audience: "https://careblockapi/",
  issuer: `https://dev-04280sry4r60xnlk.us.auth0.com`,
  algorithms: ["RS256"],
});

module.exports = checkJwt;