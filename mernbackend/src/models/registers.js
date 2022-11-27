const mongoose = require("mongoose");
const argon2 = require("argon2");
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
  workouts:[]
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
    this.pswd = await argon2.hash(this.pswd);
  }
  next();
});
// now we need to create a collection
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
