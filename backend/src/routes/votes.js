const express = require('express');
const router = express.Router();
const {incrementUpVotes,  getLeaderboard} = require('../controllers/votes');

router.post('/', incrementUpVotes);

router.get('/leaderboard', getLeaderboard);

module.exports = router;
