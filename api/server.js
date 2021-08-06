  
const path = require('path')
const express = require('express');

const server = express();

// remember express by default cannot parse JSON in request bodies

// global middlewares and the user's router need to be connected here
server.use(express.json());
server.use(express.static(path.join(__dirname, 'api/')))

const usersRouter = require('./users/users-router');
const { logger, notFound, errorHandling } = require('./middleware/middleware');

server.use('/api/users', logger, usersRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', notFound);

server.use(errorHandling);

module.exports = server;