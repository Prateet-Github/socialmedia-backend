import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import messageRoutes from './routes/message.route.js';
import postRoutes from './routes/post.route.js';
import cors from 'cors';
import http from 'http';
import { socketHandler } from './socket/socketHandler.js';
import commentRoutes from './routes/comment.route.js';
import notificationRoutes from './routes/notification.route.js';


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (_req, res) => {
  res.send('Hello from social media backend!');
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

const server = http.createServer(app);
socketHandler(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});