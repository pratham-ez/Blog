import express from "express";
import { MongoClient } from "mongodb";
import { db, connectToDb } from './db.js'

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('react-blog-db');

    const article = await db.collection('articles').findOne({ name });

    if (article) { res.json(article) }
    else {
        res.sendStatus(404);
    }



})

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('react-blog-db');

    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1 },
    });

    const article = await db.collection('articles').findOne({ name });



    if (article) {

        res.json(article);
    }
    else {
        res.send('the article has no record');
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('react-blog-db');

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text } },
    });

    const article = await db.collection('articles').findOne({ name });


    if (article) {

        res.json(article);

    }
    else {
        res.send('the article has no record');
    }
})

app.listen(8000, () => {
    console.log('server is running on 8000!');
})