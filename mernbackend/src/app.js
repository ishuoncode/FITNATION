const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");

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
    if (password === cpassword) {
      const registerEmployee = new Register({
        name: req.body.name,
        email: req.body.email,
        pswd: req.body.pswd,
        confirmpswd: req.body.confirmpswd,
      });
      const registered = await registerEmployee.save();
      res.status(201).redirect("/index");
    } else {
      res.status(403).send("password are not matched");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
