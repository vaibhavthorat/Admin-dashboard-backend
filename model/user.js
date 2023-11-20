const mongoose=require("mongoose");
const {Schema}=mongoose;
const UserSchema=new Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    email:{
            type:String,
            required:true,
            unique:true
    },
    password:{
        type:String,
        required:true
    },
},
{
    collection:"userInfo",
}
);
mongoose.model("userInfo",UserSchema);// this will create a model in mongodb