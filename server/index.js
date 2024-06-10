import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
dotenv.config();

//Const
const PORT = process.env.PORT || 4000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

//Middleware
app.use(cors());

//Connect
const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@mongo0.maximum.expert:27423/?authSource=${DB_NAME}&replicaSet=ReplicaSet&readPreference=primary`;
const client = new MongoClient(uri);

async function run() {
	try {
		await client.connect();
		console.log('Connected to MongoDB');

		app.listen(PORT, (err) => {
			if (err) {
				return console.log(`Error connecting to server`, err);
			}
			console.log(`Server running at http://localhost:${PORT}/`)
		})
	} catch (err) {
		console.log(err)
	}	finally {
		await client.close();
	}
}
run();

app.get('/', async (req, res) => {
	try {
		await client.connect();
		console.log('Connected to MongoDB');

		const database = client.db('hrTest');
		const collection = database.collection('stock');
		const data = await collection.find({}).toArray();
		res.json(data);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error connecting to the database or performing the operation')
	} finally {
		await client.close();
	}
});
