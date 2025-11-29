import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('Hello from social media backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});