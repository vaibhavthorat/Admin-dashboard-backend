const mongoose=require("mongoose");
const {Schema}=mongoose;
const FeaturesSchema=new Schema({
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
    collection:"Features",
}
);
mongoose.model("Features",FeaturesSchema);// this will create a model in mongodb