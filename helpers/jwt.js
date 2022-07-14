const jwt = require("jsonwebtoken");

const generateToken = (uid, username, role) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, username, role };
    jwt.sign(
      payload,
      process.env.SECRET_JWB_SEED,
      { expiresIn: "2h" },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token ");
        }
        resolve(token);
      }
    );
  });
};
module.exports = {
  generateToken,
};
