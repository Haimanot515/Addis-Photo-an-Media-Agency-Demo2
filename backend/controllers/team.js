const db = require("../config/dbConfig.js");

/**
 * ✅ GET /api/team
 * Public: Fetch all team members for the Team page
 */
exports.getAllTeamMembers = async (req, res) => {
  try {
    const query = `
      SELECT id, name, role, education, phone, image 
      FROM team 
      ORDER BY id ASC;
    `;
    
    const result = await db.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Team Fetch Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Unable to retrieve team members at this time." 
    });
  }
};