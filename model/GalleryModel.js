const mongoose=require("mongoose");
const {Schema}=mongoose;
const GallerySchema=new Schema({
    title:{
        type:String,
    },
    
    image:{
        type:String,
    }
},
{
    collection:"Gallery",
}
);
mongoose.model("Gallery",GallerySchema);// this will create a model in mongodb