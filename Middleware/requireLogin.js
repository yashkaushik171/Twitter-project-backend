const jwt = require("jsonwebtoken");
SECRET_KEY = "MYNAMEISYASH";
const user = require("../model/user");

module.exports = (req, res, next) => {
  const { authorization } = req?.headers;
  if (!authorization) res.status(402).json({ err: "pls login first" });

  const token = authorization?.replace("Bearer ", "");

  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) res.status(402).json({ err });
    const _id = payload?._id;

    user.findById(_id).then((response) => {
      response.password = undefined;
      req.user = response;
      next();
    });
  });
};
