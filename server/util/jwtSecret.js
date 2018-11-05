const jwt = require("jsonwebtoken");

const SECRET_KEY = "BAYYYYY";

const verifySession = (req, res, next) => {
  const { token } = req.session;

  jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
    if (err) {
      res.status(401).send({ message: "登陆已过期" });
    } else {
      res.user = { id: decodedToken.id };
      next();
    }
  });
};

module.exports = { SECRET_KEY, verifySession };
