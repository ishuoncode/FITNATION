require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const argon2 = require("argon2");
const crypto = require("crypto"); /////////node ka part hai ye
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

require("./db/conn");
const Register = require("./models/registers");
const { models } = require("mongoose");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");

const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  // check whether jwt is undefined or not.
  res.render("index", { logged_in: !!req.cookies.jwt });
});

app.get("/contact", (_req, res) => {
  res.render("contact");
});

app.get("/index", (_req, res) => {
  res.redirect("/");
});

app.get("/login", (_req, res) => {
  res.render("login");
});
app.get("/register", (_req, res) => {
  res.render("register");
});

////////secrete///////////////////
app.get("/mappy", auth, (req, res) => {
  console.log(`the cookie token is ${req.cookies.jwt}`);
  if (!req.cookies.jwt) {
    return res.redirect("/login");
  }
  res.render("mappy");
});
///////////////////////////////

app.get("/logout", auth, async function (req, res) {
  try {
    console.table(req.user);
    ///logout from one devices
    req.user.tokens = req.user.tokens.filter((currElement) => {
      return currElement.token !== req.token;
    });

    //////////////////////////
    res.clearCookie("jwt");
    await req.user.save();
    console.log("logout sucessfully");
    res.status(201).redirect("/index");
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/logoutall", auth, async function (req, res) {
  try {
    console.log(req.user);
    ///logout from one devices
    req.user.tokens = req.user.tokens.filter((currElement) => {
      return currElement.token !== req.token;
    });
    ///logout from all devices
    req.user.tokens = [];

    //////////////////////////
    res.clearCookie("jwt");
    await req.user.save();
    console.log("logout sucessfully");
    res.status(201).redirect("/index");
  } catch (error) {
    res.status(500).send(error);
  }
});

//   create new user in our database

app.post("/register", async (req, res) => {
  const password = req.body.pswd;
  const cpassword = req.body.confirmpswd;

  if (!crypto.timingSafeEqual(Buffer.from(password), Buffer.from(cpassword))) {
    return res.status(403).send("password are not matched");
  }

  const registerEmployee = new Register({
    name: req.body.name,
    email: req.body.email,
    pswd: password,
  });

  ////generating token for cookiee//////////
  const token = await registerEmployee.generateAuthToken();
  console.log("the token part " + token);

  try {
    await registerEmployee.save();
  } catch (error) {
    return res.redirect("/login");
  }

  //////////////////adding cookiee////////////////git
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 21600 * 1000),
    // httpOnly: true,
  });
  return res.redirect("/index");
});

//login check///////////////////////
app.post("/login", async (req, res) => {
  const user_db = await Register.findOne({ email: req.body.email });
  if (!user_db) {
    return res.render("login", { forgot: true });
  }

  if (!(await argon2.verify(user_db.pswd, req.body.pswd))) {
    return res.render("login", { forgot: true });
  }

  const token = await user_db.generateAuthToken();
  console.log("the token part " + token);

  /////////////adding cookie////////////////////////////////
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 21600 * 1000),
    httpOnly: true,
    //secure: true,         //---------------only use when you deploy this on secure https
  });

  res.redirect("/");
});

////////////////////////////////////////////
app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
