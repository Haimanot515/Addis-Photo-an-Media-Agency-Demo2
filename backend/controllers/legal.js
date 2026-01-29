const db = require("../config/dbConfig.js");

// GET Privacy Policy
exports.getPrivacyPolicy = async (req, res) => {
  try {
    const result = await db.query('SELECT title, content, last_updated AS "lastUpdated" FROM privacy_policy LIMIT 1');
    return res.status(200).json({ success: true, ...result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET Terms of Service
exports.getTermsOfService = async (req, res) => {
  try {
    const result = await db.query('SELECT title, content, effective_date AS "effectiveDate" FROM terms_of_service LIMIT 1');
    return res.status(200).json({ success: true, ...result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET Cookie Policy
exports.getCookiePolicy = async (req, res) => {
  try {
    const result = await db.query('SELECT title, content, last_updated AS "lastUpdated" FROM cookie_policy LIMIT 1');
    return res.status(200).json({ success: true, ...result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};