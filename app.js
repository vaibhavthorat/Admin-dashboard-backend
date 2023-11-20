const express=require("express");// first import express 
const connectToMongo=require("./db");
const { default: mongoose } = require("mongoose");
const app=express();// then initialise it to app
const bcrypt=require("bcryptjs");
const cors=require("cors");
const jwt=require("jsonwebtoken");
const JWT_SECRET="vaibhavthorat115";
var nodemailer = require('nodemailer');
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

connectToMongo();


app.listen(5000,()=>{// here listen is function of express js which know the node server is started or not
    console.log("server started vaibhav...");
})

app.post("/post",async(req,res)=>{
    let data=req.body;
    
    const {name}=data;
    try {
        if(name==="vaibhav"){
            res.send({status:"ok"});
        }
        else{
            res.send({status:"credentials wrong..."})
        }
    } catch (error) {
        res.send({status:"something went wrong on server..."})
    }
})

require("./model/user");
const User=mongoose.model("userInfo");

//EndPoint 1:  Regiser User Sart
app.post("/register",async(req,res)=>{

    const {fname,lname,base64,email,password}=req.body;
    let encryptedpassword=await bcrypt.hash(password,10);
    let oldUser=await User.findOne({email})

    if(oldUser){
        return res.send({status:"This email is already registred..."})
    }
    try {
        await User.create({
            fname,
            lname,
            image:base64,
            email,
            password:encryptedpassword,
        })
        res.send({status:"User Craeted..."})
    } catch (error) {
        res.send({error:"Something went wrong on server..."})
    }
})
//EndPoint 2:  Login User Sart
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    let user=await User.findOne({email});
    if(!user){
        return res.send({status:"Invalid Username..."})
    }

    if(await bcrypt.compare(password,user.password)){
        const token=jwt.sign({email:user.email},JWT_SECRET,{
            expiresIn:10000,
        });
        if(res.status(201)){
            return res.send({status:"ok", data:token})
        }
        else{
            return res.send({error:"Something is wrong...in else"})
        }
    }
    else{
        res.send({status:"Invalied password...", error:"invalied password..."})
    }
})
//EndPoint 3:  Get Logdin User details
app.post("/getuser",async(req,res)=>{
    const {token}=req.body;
    try {
        const user=jwt.verify(token,JWT_SECRET,(err,res)=>{
            if(err){
                return "token expired";
            }
            return res;
        })
        console.log(user);
        if(user==='token expired'){
            return res.send({status:"error", data:"token expired"})
        }
        const useremail=user.email;
        const exceptpass=await User.findOne({email:useremail}).select("-password");
        res.send(exceptpass);
        // .then((data)=>{
        //     res.send({status:"ok", data:data.fname})
        // })
        // .catch((error)=>{
        //     res.send({status:"error", data:error})
        // })
    } catch (error) {
        res.send({error:"error"})
    }
})
//EndPoint 4:  Forgot Password
app.post('/forgot-password',async(req,res)=>{
            const {email}=req.body;
            try {
                const oldUser=await User.findOne({email});
                if(!oldUser){
                    return res.json({status:"User not exist"})
                }
                const secret=JWT_SECRET + oldUser.password;
                const token=jwt.sign({email:oldUser.email,id:oldUser._id},secret,{
                    expiresIn:"5m",
                });
                const link=`http://localhost:5000/reset-password/${oldUser._id}/${token}`;
                // this is mail code
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'vaibhavthorattest@gmail.com',
                      pass: 'dgbbtfllixnuspvp'
                    }
                  });
                  
                  var mailOptions = {
                    from: 'vaibhavthorattest@gmail.com',
                    to: oldUser.email,
                    subject: "Reset Password",
                    html: `<h1>Please Click on below link to reset your password</h1><p>${link}</p>`
                    // text: "Please Click on below link to reset your password" + <br/> +link,
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        res.send({status:"Something is wrong"})
                        console.log(error);
                        console.log(info);

                    } else {
                      res.send({status:"Mail Sent to your registred Email id"})
                      console.log(error);
                      console.log(info);
                    }
                  });//mai code end here
            } catch (error) {
                res.send({error:"error"})
            }
})
//EndPoint 5:  Reset Password via link 
    app.get("/reset-password/:id/:token",async(req,res)=>{
        const {id,token}=req.params;
        const oldUser=await User.findOne({_id:id});
        if(!oldUser){
            return res.send({status:"User Dose not exists"});
        }
        const secret=JWT_SECRET+oldUser.password;
        try {
            const verify=jwt.verify(token,secret)
           res.render("index",{email:verify.email,status:'Not verified'});
        } catch (error) {
            res.send("Link Expired or something went wrong...Please try again")
        }
        console.log(req.params);
    })

    //EndPoint 6:  After clicking on link submit button this api will call
    app.post("/reset-password/:id/:token",async(req,res)=>{
        const {id,token}=req.params;
        const {password}=req.body;
    
        const oldUser=await User.findOne({_id:id});
        if(!oldUser){
            return res.send({status:"User Dose not exists"});
        }
        const secret=JWT_SECRET+oldUser.password;
        try {
            const verify=jwt.verify(token,secret)
            const encryptedpassword=await bcrypt.hash(password,10);
            await User.updateOne(
                {
                _id:id,
                 },
                 {
                    $set:{
                        password:encryptedpassword,
                    }
                 }
            )
        //    res.json({status:"password updated"})
        res.render("index",{email:verify.email,status:'verified'});

        } catch (error) {
            res.send("password not updated something is wrong")
        }
        console.log(req.params);
    })



    // Site API
    require("./model/BannerHead");
const Head=mongoose.model("BannerHead");

// const multer =require('multer')
// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'../template/React-Landing-Page-Template-master/src/images/')
//     },
//     filename:function(req,file,cb){
//         const uniquesuffux=Date.now();
//         cb(null,uniquesuffux+ file.originalname);
//     }
// })
// const upload=multer({storage:storage});
// EndPoint 1: for Heading
// app.post('/headerupdate', upload.single("image"), async(req,res)=>{
//     const imagename=req.file.filename;
//     try{
//             await Head.create({
//                 image:imagename,
//             })
//             res.json({status:"ok"})
//     }catch(error){
//         res.json({status:error})
//     }
// })

// EndPoint 2: for Getting Images
app.get('/gethead',async(req,res)=>{
    try {
        let data=await Head.find({})
        res.send(data)

    } catch (error) {
        res.send({status:error})
    }
})

app.put('/headerupdate/:id', async(req,res)=>{
    const {title,paragraph}=req.body;

        
        try{
                await Head.findOneAndUpdate(
                    { 
                        _id: req.params.id,
                        title: title,
                        paragraph: paragraph
                    }
                    )
                res.json({status:"ok"})
        }catch(error){
            res.json({status:error})
        }  
})

const multer =require('multer')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../template/React-Landing-Page-Template-master/src/images/')
    },
    filename:function(req,file,cb){
        const uniquesuffux=Date.now();
        cb(null,uniquesuffux+ file.originalname);
    }
})
const upload=multer({storage:storage});

// Features Enfpoint
require("./model/FeaturesModel");
const Features=mongoose.model("Features");

app.post('/featuresadd', upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title,description}=req.body;  

        try{
                await Features.create({
                    image:imagename,
                    title,
                    description,
                })
                res.send({status:"ok"})
        }catch(error){
            res.json({status:error})
        }
})

// endpont for fetchfeaturetitle 
app.get('/fetchfeaturetitle',async(req,res)=>{
    const titles=await Features.find({})
    res.send(titles)
})

// updating feature data
app.put('/updatefeature/:id', upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title,description}=req.body;
        try {
            await Features.findByIdAndUpdate(req.params.id,
                { 
                    image:imagename,
                    title: title,
                    description: description
                }
                )
            res.send({status:"ok"})
        } catch (error) {
            res.send({status:error})
        }
})
// delete features
app.delete('/deletefeature/:id', async(req,res)=>{
        try {
            await Features.findByIdAndDelete(req.params.id)
            res.send({status:"ok"})
        } catch (error) {
            res.send({status:error})
        }
})


// Services Endpoints
require("./model/ServicesModel");
const Services=mongoose.model("Services");
// Endpoint 1 Services
app.post('/servicesadd', upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title,description}=req.body;  

        try{
                await Services.create({
                    image:imagename,
                    title,
                    description,
                })
                res.send({status:"ok"})
        }catch(error){
            res.json({status:error})
        }
})
// delete Service
app.delete('/deleteservice/:id', async(req,res)=>{
    try {
        await Services.findByIdAndDelete(req.params.id)
        res.send({status:"ok"})
    } catch (error) {
        res.send({status:error})
    }
})

// endpont for fetchfeaturetitle 
app.get('/fetchservicestitle',async(req,res)=>{
    const titles=await Services.find({})
    res.send(titles)
})

// updating Services data
app.put('/updateservices/:id', upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title,description}=req.body;
        try {
            await Services.findByIdAndUpdate(req.params.id,
                { 
                    image:imagename,
                    title: title,
                    description: description
                }
                )
            res.send({status:"ok"})
        } catch (error) {
            res.send({status:error})
        }
})
// Testimonials Endpoints
require("./model/Testimonials");
const Testimonials=mongoose.model("Testimonials");

// Endpoint 1 Testimonials
app.post('/testimonialsadd', upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title,description}=req.body;  

        try{
                await Testimonials.create({
                    image:imagename,
                    title,
                    description,
                })
                res.send({status:"ok"})
        }catch(error){
            res.json({status:error})
        }
})

// endpont for fetchTestimonialstitle 
app.get('/fetchtestimonialstitle',async(req,res)=>{
    const titles=await Testimonials.find({})
    res.send(titles)
})

// updating Testimonials data
app.put('/updatetestimonials/:id', upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title,description}=req.body;
        try {
            await Testimonials.findByIdAndUpdate(req.params.id,
                { 
                    image:imagename,
                    title: title,
                    description: description
                }
                )
            res.send({status:"ok"})
        } catch (error) {
            res.send({status:error})
        }
})
// delete Testimonials
app.delete('/deletetestimonials/:id', async(req,res)=>{
    try {
        await Testimonials.findByIdAndDelete(req.params.id)
        res.send({status:"ok"})
    } catch (error) {
        res.send({status:error})
    }
})

// Team Endpoints
require("./model/TeamModel");
const Team=mongoose.model("Team");

// Endpoint 1 Team
app.post('/teamadd', upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title,description}=req.body;  

        try{
                await Team.create({
                    image:imagename,
                    title,
                    description,
                })
                res.send({status:"ok"})
        }catch(error){
            res.json({status:error})
        }
})

// endpont for fetchTeamtitle 
app.get('/fetchteamtitle',async(req,res)=>{
    const titles=await Team.find({})
    res.send(titles)
})

// updating Team data
app.put('/updateteam/:id', upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title,description}=req.body;
        try {
            await Team.findByIdAndUpdate(req.params.id,
                { 
                    image:imagename,
                    title: title,
                    description: description
                }
                )
            res.send({status:"ok"})
        } catch (error) {
            res.send({status:error})
        }
})

// delete Team
app.delete('/deleteteam/:id', async(req,res)=>{
    try {
        await Team.findByIdAndDelete(req.params.id)
        res.send({status:"ok"})
    } catch (error) {
        res.send({status:error})
    }
})

// Gallery Endpoints
require("./model/GalleryModel");
const Gallery=mongoose.model("Gallery");

app.post('/addimgtogallery',upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title}=req.body;
 try {
    Gallery.create({
        title,
        image:imagename,
    })
    res.send({status:"ok"})
 } catch (error) {
    res.send({status:error})
 }
    
})
// endpont for fetch Gallery Image 
app.get('/fetchgalleryimage',async(req,res)=>{
    const titles=await Gallery.find({})
    res.send(titles)
})
// updating allery Image
app.put('/updateimg/:id', upload.single("image"), async(req,res)=>{
    const imagename=req.file.filename;
    const {title}=req.body;
        try {
            await Gallery.findByIdAndUpdate(req.params.id,
                { 
                    image:imagename,
                    title: title,
                }
                )
            res.send({status:"ok"})
        } catch (error) {
            res.send({status:error})
        }
})
// delete Image
app.delete('/deleteimage/:id', async(req,res)=>{
    try {
        await Gallery.findByIdAndDelete(req.params.id)
        res.send({status:"ok"})
    } catch (error) {
        res.send({status:error})
    }
})