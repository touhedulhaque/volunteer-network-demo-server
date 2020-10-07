const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujfln.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("volunteerNetwork").collection("services");
    const registrationsCollection = client.db("volunteerNetwork").collection("registrations");
    //load all service data to DB
    app.post('/addService', (req, res) => {
        const services = req.body;
        servicesCollection.insertMany(services)
            .then(result => {
                res.send(result.insertedCount)
            })
    })
    //show all service data to Home page from DB
    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    //get individual dynamic data from DB
    app.get('/service/:_id', (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params._id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    // add registration data to DB in new cluster
    app.post('/addRegistration', (req, res) => {
        const serviceRegistration = req.body;
        registrationsCollection.insertOne(serviceRegistration)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    


    //show all registrations to admin from DB b
    app.get('/registrations', (req, res) => {
        console.log(req.query.email)
        registrationsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // show individual registrations to blog from DB b
    app.get('/registrations', (req, res) => {
        console.log(req.query.email)
        registrationsCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    
});




app.listen(process.env.PORT || port)