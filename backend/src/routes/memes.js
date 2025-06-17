const express = require('express');
const router = express.Router();
const { createMeme, getMemeById, getAllMemes } = require('../controllers/memes');

router.post('/', createMeme);

router.get('/', getAllMemes );

router.get('/:id', getMemeById);

module.exports = router;
