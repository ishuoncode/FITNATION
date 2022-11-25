const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pswd: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//////////generating token////
employeeSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY,
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    // console.log(token);
    return token;
  } catch (error) {
    console.log("the error part" + error);
  }
};

/////////////password hash////////////////////////////////

employeeSchema.pre("save", async function (next) {
  if (this.isModified("pswd")) {
    // console.log(`Actual password ${this.pswd}`);
    this.pswd = await bcrypt.hash(this.pswd, 12);
    // console.log(`hash password ${this.pswd}`);
    // this.confirmpswd = await bcrypt.hash(this.pswd, 12);
  }
  next();
});
// now we need to create a collection
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
