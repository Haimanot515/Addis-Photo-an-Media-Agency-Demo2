const db = require("../config/dbConfig.js");

/**
 * ✅ GET /api/services
 * Public: Fetch all services offered
 */
exports.getAllServices = async (req, res) => {
  try {
    const query = `
      SELECT id, title, description 
      FROM services 
      ORDER BY id ASC;
    `;
    
    const result = await db.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Services Fetch Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Server error: Unable to load services." 
    });
  }
};