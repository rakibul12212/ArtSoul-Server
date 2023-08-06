require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express()
const port=process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ServerApiVersion} = require('mongodb');


app.use(cors()) // enable cross-origin resource sharing (CORS)
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.s4daxap.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database =client.db('artsoul')
   const classCollection=database.collection('classes')
   const usersCollection = database.collection("Users");
   const orderCollection = database.collection("Orders");

   app.get('/classes',async(req,res)=>{
    const query ={}
    const cursor=classCollection.find(query)
    const classes = await cursor.toArray()
    res.send(classes)
   })
   // Add Class  API To the database
   app.post("/classes", async (req, res) => {
    const classes = req.body;
    const result = await classCollection.insertOne(classes);
    res.json(result);
  });
   app.get('/classes/:id',async(req,res)=>{
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const classDetails =await classCollection.findOne(query);
    res.send(classDetails);
   })

  //  find all users
  app.get('/findusers',async(req,res)=>{
    const query ={}
    const cursor=usersCollection.find(query)
    const users = await cursor.toArray()
    res.send(users)
    
   })

   // Set users info into database
   app.post("/users", async (req, res) => {
    const user = req.body;
    result = await usersCollection.insertOne(user);
    res.json(result);
  });

   // Set An User Admin and Sent to the database
   app.put("/users/admin", async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const updateDoc = { $set: { role: "admin" } };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.json(result);
  });
   // Set An User Instructor and Sent to the database
   app.put("/users/instructor", async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const updateDoc = { $set: { role: "instructor" } };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.json(result);
  });
  // Find Admin to show many things
  app.get("/users/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === "admin") {
      isAdmin = true;
      res.json({ admin: isAdmin });
    }
    else if (user?.role === "instructor") {
      isInstructor = true;
      res.json({ instructor: isInstructor });
    }
    
  });
    // DELETE PRODUCT on Products API
    app.delete("/class/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await classCollection.deleteOne(query);
      res.json(result);
    });
    // Add Order API To the database
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });
    // GET ALL ORDERS FROM Orders API Database
    app.get("/orders/manageAllOrders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const allOrders = await cursor.toArray();
      res.json(allOrders);
    });

    // UPDATE STATUS From Orders Collection API
    app.put("/status/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: data.isStatus,
        },
      };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.json(result);
    });

    // DELETE ORDER API
    app.delete("/order/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    // ADD REVIEWS TO THE DATABASE
    app.post("/review", async (req, res) => {
      const reviews = req.body;
      console.log("hitting review", reviews);
      const result = await reviewsCollection.insertOne(reviews);
      res.json(result);
    });
    // GET ALL REVIEWS FROM DATABASE
    app.get("/home/review", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.json(reviews);
    });
    // Set An User Admin and Sent to the database
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // Find Admin to show many things
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // Put User login info in database
    app.post("/users", async (req, res) => {
      const user = req.body;
      result = await usersCollection.insertOne(user);
      res.json(result);
    });
  // check user info if found then ignore if not found then add user info to our database. this is work while use google popup login & emailPass login or register

  app.put("/users", async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const option = { upsert: true };
    const updateDoc = { $set: user };
    result = await usersCollection.updateOne(filter, updateDoc, option);
    res.json(result);
  });

  } finally {
    
  }
}
run().catch(error=>console.error(error));




app.get("/",(req, res)=> {
    res.send("ArtSoul server is running ...");
  });
  
  app.listen(port, ()=> {
    console.log(`Artsoul server is running on port ${port}!`);
  });
