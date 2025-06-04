require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');

// > Routers
const UserRoutes = require('./routes/userRoute');
const NoteRoute = require('./routes/noteRoute');
const BoardRoutes = require('./routes/boardRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${fullUrl} ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// ? routes | middleware
app.use('/api/user', UserRoutes);
app.use('/api/note', NoteRoute);
app.use('/api/board', BoardRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database ❤️');
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('Listening for requests on port', process.env.PORT, '❤️');
    });
  })
  .catch((err) => {
    console.error(err, '💔');
  });