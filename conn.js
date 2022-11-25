const mongoose =require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/fitnation",{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    // useCreateIndex: true
}).then(()=>{
    console.log(`connection sucessfull`);
}).catch((err)=>{
    console.log(err);
    console.log(`no connection`);
})