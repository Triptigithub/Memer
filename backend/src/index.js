const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const memesRouter = require('./routes/memes');
const bidsRouter = require('./routes/bids');
const votesRouter = require('./routes/votes');
const aiRouter = require('./routes/ai');
const initSocket = require('./realtime/socket');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/memes', memesRouter);
app.use('/api/bids', bidsRouter);
app.use('/api/votes', votesRouter);
app.use('/api/ai', aiRouter);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = initSocket(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
