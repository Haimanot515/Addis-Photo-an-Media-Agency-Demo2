const db = require("../config/dbConfig.js");

/**
 * ✅ GET /api/portfolio
 * Public: Fetch all gallery items for the Portfolio page
 */
exports.getAllPortfolioItems = async (req, res) => {
  try {
    const query = `
      SELECT id, src, alt, created_at 
      FROM portfolio 
      ORDER BY id ASC;
    `;
    
    const result = await db.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Portfolio Fetch Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Server error: Unable to load portfolio." 
    });
  }
};