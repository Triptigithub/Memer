const supabase = require("../db/supabaseClient");
const cache = require("../utils/cache");

exports.incrementUpVotes = async (req, res) => {
  try {
    const { meme_id, delta } = req.body;
    if (!meme_id || ![1, -1].includes(delta)) {
      return res.status(400).json({ error: "Invalid fields" });
    }

    const { error } = await supabase.rpc("increment_upvotes", {
      p_meme_id: meme_id,
      p_delta: delta,
    });
    if (error) return res.status(500).json({ error: error.message });
    cache.delete("leaderboard");
    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const cached = cache.get("leaderboard");
    if (cached) return res.json(cached);
    const { data, error } = await supabase
      .from("memes")
      .select("*")
      .order("upvotes", { ascending: false })
      .limit(10);
    if (error) return res.status(500).json({ error: error.message });
    cache.set("leaderboard", data);
    res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
