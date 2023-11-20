const mongoose=require("mongoose");
const {Schema}=mongoose;
const ServicesSchema=new Schema({
    // title:{
    //     type:String,
    // },
    image:{
        type:String,
    },
    title:{
        type:String,
    },
    description:{
        type:String,
    }
},
{
    collection:"Services",
}
);
mongoose.model("Services",ServicesSchema);// this will create a model in mongodb