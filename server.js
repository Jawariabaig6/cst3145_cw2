//create an Express.js instance 
const express = require("express");

const app = express();
//config Express.js 
app.use(express.json());
app.set("port", 3000);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
//mongo db connection 
const MongoClient = require("mongodb").MongoClient;
let db;
MongoClient.connect("mongodb+srv://JawairiaBaig:jawairiamongo@cluster0.wwyyyvx.mongodb.net",
  (err, client) => {
    db = client.db("webstore");
  }
);

// Intializing the the first route
app.get("/", (req, res, next) => {
  res.send("Select a collection, e.g, /collection/massages");
});
//Get the collection name 
app.param('collectionName',(req,res,next,collectionName)=>{
    req.collection = db.collection(collectionName);
    return next();
})

app.get('/collection/:collectionName',(req,res,next)=>{
    req.collection.find({}).toArray((e,results)=>{
        if(e) return next(e)
        res.send(results);
    })
})

app.post('/collection/:collectionName',(req,res,next)=>{
    req.collection.insert(req.body,(e,results)=>{
        if(e) return next(e)
        res.send(results.ops);
    })
})

const ObjectID = require ('mongodb').ObjectId;
app.get('/collection/:collectionName/:id',(req,res,next)=>{
    req.collection.findOne({_id :new ObjectID(req.params.id)},(e, result)=>{
        if(e) return next(e)
        res.send(result)
    })
})

//UPDATE/PUT 
app.put ('/collection/:collectionName/:id',(req,res,next)=>{
    req.collection.update(
       { _id: new ObjectID (req.params.id)},
       {$set: req.body},
       {safe: true, multi: false},
       (e,result)=>{
        if(e) return next(e)
        res.send((result=1)? {msg:'success'}:{msg:'error'})
       }
    )
})

app.listen(5000, () => {
  console.log("Express.js server running at localhost : 5000");
});
