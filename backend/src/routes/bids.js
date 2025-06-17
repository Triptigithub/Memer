const express = require("express");
const router = express.Router();
const { createBid, getBidsByMeme } = require("../controllers/bids");

router.post("/", createBid);

router.get("/:meme_id", getBidsByMeme);

module.exports = router;
