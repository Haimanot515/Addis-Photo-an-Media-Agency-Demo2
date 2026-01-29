const db = require("../config/dbConfig.js");

/**
 * ✅ GET /api/features
 * Public: Fetch all featured works for the Home Page gallery
 */
exports.getFeaturedWorks = async (req, res) => {
  try {
    const query = `
      SELECT id, src, alt, created_at 
      FROM features 
      ORDER BY id DESC;
    `;
    
    const result = await db.query(query);

    return res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (err) {
    console.error("Featured Works Fetch Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Server error: Unable to load featured works." 
    });
  }
};

/**
 * ✅ GET /api/hero
 * Public: Fetch hero section content (Image, Title, Subtitle, Marquee)
 */
exports.getHeroData = async (req, res) => {
  try {
    const query = `
      SELECT id, hero_bg, hero_title, hero_subtitle, hero_marquee 
      FROM hero 
      LIMIT 1;
    `;
    
    const result = await db.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Hero Data Fetch Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Server error: Unable to load hero section." 
    });
  }
};

/**
 * ✅ POST /api/subscribe
 * Public: Add a new email to the subscription list
 */
exports.subscribeUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: "Email is required." 
    });
  }

  try {
    // 1. Check if email exists
    const checkQuery = "SELECT id FROM subscribers WHERE email = $1;";
    const checkResult = await db.query(checkQuery, [email]);

    if (checkResult.rowCount > 0) {
      return res.status(409).json({ 
        success: false, 
        message: "You are already subscribed!" 
      });
    }

    // 2. Insert new subscriber
    const insertQuery = "INSERT INTO subscribers (email) VALUES ($1) RETURNING id;";
    await db.query(insertQuery, [email]);

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to Addis Photo & Media Agency!"
    });
    
  } catch (err) {
    console.error("Subscription Error:", err.message);
    
    // ERROR handling for missing table after a DROP
    if (err.message.includes("does not exist")) {
      return res.status(500).json({ 
        success: false, 
        message: "Database error: Subscriber table not found." 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "Server error: Unable to process subscription." 
    });
  }
};