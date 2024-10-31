const jwt = require("jsonwebtoken");

const generateAuthToken = (userId) => {
  // const secretKey = process.env.SECRET_KEY; //sangkiplaimportantkey

  // if (!secretKey) {
  //   throw new Error("JWT secret key is not defined");
  // }

  const token = jwt.sign(
    {
      userId,
    },
    "sangkiplaimportantkey",
    {
      expiresIn: "60d",
    }
  );
  return token;
};

module.exports = generateAuthToken;
