const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://crud_user_1:YpR2pm5yjSj2ReXW@cluster0.mzolur4.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const database = client.db("restaurant");
        const usersCollection = database.collection("users");
        // GET API 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await usersCollection.findOne(query);
            res.send(user)
            console.log('hitted with id=', id);
        })
        // POST API 
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            // console.log('Hitting the post', req.body);
            // res.send('hit the post')

            const result = await usersCollection.insertOne(newUser);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })

        // DELETE API 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            console.log('deleting user with id', result)
            res.json(result)
        })

        //UPDATE API

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, option)
            console.log('User Updated', req.body);
            res.json(result)
        })
        // // create a document to insert
        // const doc = {
        //     name: "Rahim Uddin",
        //     email: "ami@rahim.uddin",
        // }
        // const result = await haiku.insertOne(doc);
        // console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my CRUD Server')
});

app.listen(port, () => {
    console.log('Running Server on Port', port);
})