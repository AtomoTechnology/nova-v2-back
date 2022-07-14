const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJsonWebToken = (req, res = response, next) => {
  const token = req.header("x-token");
  //   console.log(token);
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Token no existe",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_JWB_SEED);
    console.log("payloadVerify", payload);

    req.uid = payload.uid;
    req.username = payload.username;
    req.role = payload.role;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }

  next();
};
module.exports = {
  validateJsonWebToken,
};
