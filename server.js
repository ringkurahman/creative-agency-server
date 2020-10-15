const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.extbg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('doctors'));
app.use(fileUpload());



client.connect(err => {
    const serviceCollection = client.db("creativeAgency").collection("services");
    const adminCollection = client.db("creativeAgency").collection("admin");
    const orderCollection = client.db("creativeAgency").collection("order");
    const reviewCollection = client.db("creativeAgency").collection("review");
    const messageCollection = client.db("creativeAgency").collection("message");

    app.get('/', (req, res) => {
        res.send('Creative Agency server running...')
    })
    
    // @desc    Add all services
    // @route   POST /addService
    // @access  Admin
    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const desc = req.body.desc;
        // console.log(file, title, desc);
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ title, desc, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // @desc    Add doctor
    // @route   POST /addAdmin
    // @access  Admin
    app.post('/addAdmin', (req, res) => {
        const email = req.body;
        adminCollection.insertOne(email)
            .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    // @desc    Verify doctor email
    // @route   POST /isAdmin
    // @access  Admin
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, doctors) => {
                res.send(doctors.length > 0);
            })
    })

    // @desc    Add all order
    // @route   POST /addOrder
    // @access  Customer
    app.post('/addOrder', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const title = req.body.title;
        const desc = req.body.desc;
        const price = req.body.price;
        // console.log(file, name, email, title, desc, price);
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };

        orderCollection.insertOne({ name, email, title, desc, price, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // @desc    Get user order by email
    // @route   GET /addOrder
    // @access  Customer
    app.get('/addOrder', (req, res) => {
        const email = req.query.email;
        orderCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // @desc    Add review
    // @route   POST /addReview
    // @access  Customer
    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
            .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    // @desc    Get all customers order list
    // @route   GET /serviceList
    // @access  Admin
    app.get('/serviceList', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
            res.send(documents)
        })
    })

    // @desc    Get all services
    // @route   GET /serviceArea
    // @access  Admin
    app.get('/serviceArea', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
            res.send(documents)
        })
    })

    // @desc    Get all services
    // @route   GET /serviceArea
    // @access  Admin
    app.get('/reviewArea', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
            res.send(documents)
        })
    })

    // @desc    Add contact message
    // @route   POST /contactMessage
    // @access  Admin
    app.post('/contactMessage', (req, res) => {
        const data = req.body;
        messageCollection.insertOne(data)
            .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

  
});






app.listen(process.env.PORT || 5000)