const express = require('express');

const postRouter = require('./postRouter');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send(`
    <h2>up and running</h>
  `);
});

server.use('/api/posts', postRouter);


module.exports = server;