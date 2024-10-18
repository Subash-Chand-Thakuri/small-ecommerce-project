import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors'

import productRoutes from './routes/productRoutes.js';
import courierChargesRoutes from './routes/courierChargesRoutes.js';
import placeOrderRoutes from './routes/placeOrderRoutes.js';
import { initializeDb } from "./config/db.js";

const app = express();
dotenv.config();
app.use(cors({origin:'*'}))
app.use(morgan('dev')); 
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.use('/api/product',productRoutes);
app.use('/api/courier-charges',courierChargesRoutes);
app.use('/api/place-order',placeOrderRoutes);


 // Error Handler
 app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

initializeDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize the database. Server not started.', err);
});
