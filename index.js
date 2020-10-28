const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3jp9t.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 4000;

app.get('/', (req, res) => {
  res.send(' db is working')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appoinmentCollection = client.db("doctors-portal").collection("appoinment");
  const adminCollection = client.db("doctors-portal").collection("adminPanel");
  // perform actions on the collection object
 
  app.post('/addAppoinment', (req, res) => {
      const appoinment= req.body;
      appoinmentCollection.insertOne(appoinment)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/AppoinmentsDate', (req, res) => {
    const date= req.body;
    console.log(date.date);
    appoinmentCollection.find({date: date.date})
    .toArray((err, documents) => {
        res.send(documents)
    })
})

// recive all data
app.get('/allApoinmets', (req, res) => {
  appoinmentCollection.find({})
  .toArray((err, documents) => {
      res.send(documents)
  })
})

// adminpanel
app.get('/checkAdmin', (req, res) => {
  const email = req.query.email;
  adminCollection.find({email: email})
  .toArray((err, documents) => {
    if (documents.length === 0) {
      res.send({admin:false})      
    }else {
      res.send({admin:true})
    }
  })
})


});

app.listen(process.env.PORT || port)
