const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

///middleware
app.use(express.json())
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0veicth.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        const AllCollection = client.db('jobseeker').collection('alljobs')
        const alltypeCollection = client.db('jobseeker').collection('jobtype')
        const bidsCollection = client.db('jobseeker').collection('bids')
        const addJobCollection = client.db('jobseeker').collection('addjobs')
        ///get all type of job
        app.get('/alltype', async (req, res) => {
            const cursor = alltypeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        ///get all data of web,digital marketing,graphic design development    
        app.get('/alljobs', async (req, res) => {
            const cursor = AllCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        ////get specific job detail from database using  id
        app.get('/alljobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AllCollection.findOne(query);
            res.send(result)
        })



        ////post bids data into the database
        app.post('/bids', async (req, res) => {
            const bid = req.body;
            const result = await bidsCollection.insertOne(bid)
            res.send(result)
        })

        ////get bids data into the database
        app.get('/bids', async (req, res) => {
            const cursor = bidsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        ////post add job data into the database
        app.post('/addjobs', async (req, res) => {
            const bid = req.body;
            const result = await addJobCollection.insertOne(bid)
            res.send(result)
        })

        ////get add job data into the database
        app.get('/addjobs', async (req, res) => {
            const cursor = addJobCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        ///update a specific data and store into database
        app.put('/addjob/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const jobInfo = req.body;
            const updateedJob = {
                $set: {
                    job_title: jobInfo.job_title,
                    email: jobInfo.email,
                    minamount: jobInfo.minamount,
                    maxamount: jobInfo.maxamount,
                    deadline: jobInfo.deadline,
                    short_description: jobInfo.short_description,
                    type: jobInfo.type,
                }
            }
            const result = await addJobCollection.updateOne(filter, updateedJob, options)
            res.send(result);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Job seeker serv is running')
})

app.listen(port, () => {
    console.log(`Job seeker server is running on ${port}`)
})