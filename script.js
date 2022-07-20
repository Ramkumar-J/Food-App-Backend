let express=require("express");
let cors=require("cors");
let mongodb=require("mongodb");
let bcrypt=require("bcryptjs");
let jwt=require("jsonwebtoken");
let app=express();
app.use(express.json());
app.use(cors({
    origin:["http://localhost:3000","https://graceful-sunshine-edf9ff.netlify.app"]
}))
let mongoClient=mongodb.MongoClient;
let URL="mongodb+srv://ramkumar:ramrk123@cluster0.yecly.mongodb.net/?retryWrites=true&w=majority";

app.post("/register",async (req,res) => {
try {
    let connection=await mongoClient.connect(URL);
    let db=connection.db("food-items");
    let salt=bcrypt.genSaltSync(10);
    let hash=bcrypt.hashSync(req.body.password,salt);
    req.body.password=hash;
    await db.collection("users").insertOne(req.body);
    await connection.close();
    res.json({message:"User Registered Successfully"});
} catch (error) {
    res.status(500).json({message:"Something went wrong"});
}
})

app.post("/login",async (req,res) => {
    try {
        let connection=await mongoClient.connect(URL);
        let db=connection.db("food-items");
        let usercheck=await db.collection("users").findOne({email:req.body.email});
        if(usercheck){
            let compareuser=bcrypt.compareSync(req.body.password,usercheck.password);
            if(compareuser){
                // Generate JWT Token
                let jwtToken=jwt.sign({name:usercheck.name,id:usercheck._id},"foodappsecretkey");
                res.json({token:jwtToken});
            }else{
                res.status(401).json({message:"Credential not found"});
            }
        }else{
            res.status(401).json({message:"Credential not found"});
        }
        await connection.close();
        res.json({message:"Login Successfully"});
    } catch (error) {
        res.status(500).json({message:"Something went wrong"});
    }
    })



app.post("/foodmenu",async (req,res) => {
try {
   let connection=await mongoClient.connect(URL);
   let db=connection.db("food-items");
   await db.collection("foods").insertOne(req.body);
   await connection.close();
   res.json({message:"Food Item added succesfully"});
} catch (error) {
    res.status(500).json({message:"Something went wrong"});
}
})

app.get("/foodmenu",async (req,res) => {
    try {
       let connection=await mongoClient.connect(URL);
       let db=connection.db("food-items");
       let foods=await  db.collection("foods").find().toArray();
       await connection.close();
       res.json(foods);
    } catch (error) {
        res.status(500).json({message:"Something went wrong"});
    }
    })

app.get("/foodmenu/:id",async (req,res) => {
    try {
       let connection=await mongoClient.connect(URL);
       let db=connection.db("food-items");
       let food=await  db.collection("foods").findOne({_id:mongodb.ObjectId(req.params)});
       await connection.close();
       res.json(food);
    } catch (error) {
        res.status(500).json({message:"Something went wrong"});
    }
    })

app.put("/foodmenu/:id",async (req,res) => {
    try {
       let connection=await mongoClient.connect(URL);
       let db=connection.db("food-items");
       await  db.collection("foods").updateOne({_id:mongodb.ObjectId(req.params.id)},{$set:req.body});
       await connection.close();
       res.json({message:"Food updated successfully"});
    } catch (error) {
        res.status(500).json({message:"Something went wrong"});
    }
    })    

app.delete("/foodmenu/:id",async (req,res) => {
    try {
       let connection=await mongoClient.connect(URL);
       let db=connection.db("food-items");
       await  db.collection("foods").deleteOne({_id:mongodb.ObjectId(req.params.id)});
       await connection.close();
       res.json({message:"Food deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"Something went wrong"});
    }
    })

app.get("/foodmenu/:category",async (req,res) => {
    try {
       let connection=await mongoClient.connect(URL);
       let db=connection.db("food-items");
       let food=await  db.collection("foods").find({category:(req.params.category)}).toArray();
       await connection.close();
       res.json(food);
    } catch (error) {
        res.status(500).json({message:"Something went wrong"});
    }
    })


    app.listen(3005, () => {
        console.log("webserver on");
      });