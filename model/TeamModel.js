const mongoose=require("mongoose");
const {Schema}=mongoose;
const TeamSchema=new Schema({
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
    collection:"Team",
}
);
mongoose.model("Team",TeamSchema);// this will create a model in mongodb