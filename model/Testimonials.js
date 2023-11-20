const mongoose=require("mongoose");
const {Schema}=mongoose;
const TestimonialsSchema=new Schema({
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
    collection:"Testimonials",
}
);
mongoose.model("Testimonials",TestimonialsSchema);// this will create a model in mongodb