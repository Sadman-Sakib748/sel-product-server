const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.re9eo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const productCollection = client.db("aurum").collection("products");
    const commentCollection = client.db("aurum").collection("comments");
    const contactCollection = client.db("aurum").collection("contacts");
    const cartsCollection = client.db("aurum").collection("carts");




    // comment

    // POST comment to database
    app.post('/comment', async (req, res) => {
      const menuItem = {
        ...req.body,
        timestamp: new Date(),
        profileImage: req.body.profileImage || "https://i.pravatar.cc/64" // Default profile image
      };
      const result = await commentCollection.insertOne(menuItem);
      res.send(result);
    });



    // GET all comments
    app.get("/comments", async (req, res) => {
      const comments = await commentCollection.find().toArray();
      res.send(comments);
    });



    // POST route to handle the contact form
    app.post('/contact', async (req, res) => {
      const menuItem = req.body;
      const result = await contactCollection.insertOne(menuItem);
      res.send(result);
    })

    app.get('/products', async (req, res) => {
      const products = await productCollection.find().toArray();
      res.send(products);
  });
  
  // 🛒 POST Add to Cart
  app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartsCollection.insertOne(cartItem);
      res.send(result);
  });

    // Connect the client to the server	(optional starting in v4.7)

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('boss is running')
})
app.listen(port, () => {
  console.log(`${port} server running`)
})