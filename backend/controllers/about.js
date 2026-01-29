const db = require("../config/dbConfig.js");

exports.getAboutInfo = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM about LIMIT 1");
    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};