const mongoose=require("mongoose");
const {Schema}=mongoose;
const HeaderSchema=new Schema({
    // title:{
    //     type:String,
    // },

    title:{
        type:String,
    },
    paragraph:{
        type:String,
    }
},
{
    collection:"BannerHead",
}
);
mongoose.model("BannerHead",HeaderSchema);// this will create a model in mongodb