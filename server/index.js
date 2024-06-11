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

//Список и количесво авто каждой марки
app.get('/brands', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db(`${DB_NAME}`).collection("stock");

    const brandsAggregation = [
      {
        $group: {
          _id: "$mark",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          mark: "$_id",
          count: 1
        }
      },
      { $sort : { mark : 1 } }
    ];

    const brands = await collection.aggregate(brandsAggregation).toArray();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await client.close();
  }
});

//Список авто в зависимости от выбранной марки
app.get('/models/:brand', async (req, res) => {
  const brand = req.params.brand;
  try {
    await client.connect();
    const collection = client.db(`${DB_NAME}`).collection("stock");

    const modelsAggregation = [
      {
        $match: {
          mark: brand
        }
      },
      {
        $group: {
          _id: "$model"
        }
      },
      {
        $project: {
          _id: 0,
          model: "$_id"
        }
      },
      { $sort : { model : 1 } }
    ];

    const models = await collection.aggregate(modelsAggregation).toArray();
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await client.close();
  }
});

//Фильтрация
app.get('/stock', async (req, res) => {
  const { mark, model } = req.query;
  let { page, limit } = req.query;

  //Значения по умолчанию для пагинации
  page = page ? parseInt(page, 10) : 1;
  limit = limit ? parseInt(limit, 10) : 20;

  const skip = (page - 1) * limit;

  try {
    await client.connect();
    const collection = client.db(`${DB_NAME}`).collection("stock");

    //Фильтрация: объект фильтра в зависимости от переданных параметров
    let filter = {};
    if (mark) filter.mark = mark;
    if (model) filter['model'] = model;

    const cars = await collection.find(filter).skip(skip).limit(limit).toArray();

    //Общее количество автомобилей, соответствующих фильтрам
    const count = await collection.countDocuments(filter);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
      data: cars
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});