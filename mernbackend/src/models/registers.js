const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const employeeSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    pswd:{
        type: String,
        required: true
    },
    confirmpswd:{
        type: String,
        required: true
    }
});
employeeSchema.pre("save",async function(next){
    if(this.isModified("pswd")){
        // console.log(`Actual password ${this.pswd}`);
        this.pswd = await bcrypt.hash(this.pswd,12);
        // console.log(`hash password ${this.pswd}`);
        this.confirmpswd=undefined;//no logoner use confirm password
    }
    next();
})
// now we need to create a collection 
const Register = new mongoose.model("Register", employeeSchema);

module.exports =Register;