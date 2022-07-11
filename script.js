let express=require("express");
let cors=require("cors");
let mongodb=require("mongodb");
let bcrypt=require("bcryptjs");
let jwt=require("jsonwebtoken");
let app=express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
}))
let mongoClient=mongodb.MongoClient;
let URL="mongodb+srv://ramkumar:ramrk123@cluster0.yecly.mongodb.net/?retryWrites=true&w=majority";

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