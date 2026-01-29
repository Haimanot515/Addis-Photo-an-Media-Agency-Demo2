const db = require("../config/dbConfig.js");

exports.contact = async (req, res) => {
  try {
    // Uses the ID attached by the authMiddleware
    const userInternalId = req.user.id; 
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const query = `
      INSERT INTO contacts (user_internal_id, name, email, phone, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at;
    `;
    
    const values = [userInternalId, name.trim(), email.trim(), phone || null, message.trim()];
    const result = await db.query(query, values);

    return res.status(201).json({
      success: true,
      message: "Message sent!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Controller Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};