require('dotenv').config();
const express = require('express')
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

///middleware
app.use(express.json())
app.use(cors())



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


        ////post add job data into the database
        app.post('/alljobs', async (req, res) => {
            const bid = req.body;
            const result = await AllCollection.insertOne(bid)
            res.send(result)
        })



        ////post bids data into the database
        app.post('/bids', async (req, res) => {
            const bid = req.body;
            const result = await bidsCollection.insertOne(bid)
            res.send(result)
        })


        // ////get bids data into the database using email query
        app.get('/bids', async (req, res) => {
            console.log("Bids req email:", req.query.email)
            const queryEmail = req.query.email
            let query = { userEmail: queryEmail };
            const cursor = bidsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        ////get specific job detail from database using  id
        app.get('/allbids', async (req, res) => {
            const cursor = bidsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        ///patch a specific data using id and store
        app.put('/bids/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedjob = req.body;
            const updateDoc = {
                $set: {
                    status: updatedjob.status,
                    job_title: updatedjob.job_title,
                    userEmail: updatedjob.email,
                    deadline: updatedjob.deadline,
                }
            }
            const result = await bidsCollection.updateOne(filter, updateDoc)
            res.send(result)
        })




        ////get add job data into the database using email query
        app.get('/addjobs', async (req, res) => {
            console.log("Req.query.email", req.query.email)
            const queryEmail = req.query.email
            const query = { email: queryEmail }
            const cursor = addJobCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        ////get specific job detail from database using  id
        app.get('/addjobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addJobCollection.findOne(query);
            res.send(result)
        })


        ///update a specific data and store into database
        app.put('/addjobs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedjob = req.body;
            const updatedJob = {
                $set: {
                    job_title: updatedjob.job_title,
                    email: updatedjob.email,
                    minamount: updatedjob.minamount,
                    maxamount: updatedjob.maxamount,
                    deadline: updatedjob.deadline,
                    short_description: updatedjob.short_description,
                    type: updatedjob.type,
                }
            }
            const result = await addJobCollection.updateOne(filter, updatedJob, options)
            res.send(result);
        })


        ///Delete a specific data and store into database
        app.delete('/addjobs/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await addJobCollection.deleteOne(query);
            res.send(result)
        })


        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
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