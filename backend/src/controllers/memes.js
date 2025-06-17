const supabase = require("../db/supabaseClient");

exports.createMeme = async (req, res) => {
  try {
    const { title, image_url, tags, owner_id } = req.body;
    if (!title || !image_url || !owner_id) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const { data, error } = await supabase
      .from("memes")
      .insert([{ title, image_url, tags, owner_id }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllMemes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("memes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("memes")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return res.status(404).json({ error: "Meme not found" });
    res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
