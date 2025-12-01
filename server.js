import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from social media backend!');
});

app.use('/api/users', userRoutes);
app.use('/api/posts',postRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});