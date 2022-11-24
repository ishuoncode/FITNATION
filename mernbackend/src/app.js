const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");/////////node ka part hai ye 

require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");

const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//   create new user in our database
app.post("/register", async (req, res) => {
  try {
    const password = req.body.pswd;
    const cpassword = req.body.confirmpswd;
    console.log(password, cpassword);
    if (crypto.timingSafeEqual(Buffer.from(password), Buffer.from(cpassword))) {
      const registerEmployee = new Register({
        name: req.body.name,
        email: req.body.email,
        pswd: req.body.pswd,
      });
      ////generating token for cookiee//////////
      console.log("the sucesspart " + registerEmployee);
      const token = await registerEmployee.generateAuthToken();
      console.log("the token part " + token);

      const registered = await registerEmployee.save();
      res.status(201).redirect("/index");
    } else {
      res.status(403).send("password are not matched");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    console.log("the error part page");
  }
});

//login check///////////////////////
app.post("/loggedin", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.pswd;
    const useremail = await Register.findOne({ email: email });
    //  res.send(useremail);
    //  console.log(useremail);
    const isMatch = await bcrypt.compare(password, useremail.pswd);
    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("invalid login details");
    }
  } catch (error) {
    res.status(403).send("invalid login details");
  }
});

////////////////////////////////////////////
app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
