const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  let user_jwt = null;
  try {
    user_jwt = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.redirect("/login");
  }

  let user_db = null;
  try {
    user_db = await Register.findOne({ _id: user_jwt._id });
  } catch (error) {
    res.redirect("/login");
  }

  ///used in logout get in app.js
  req.token = token;
  req.user = user_db;
  next();
};
module.exports = auth;
