require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const UserRoutes = require('./routes/userRoute');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// ? routes
app.use('/api/user', UserRoutes)

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