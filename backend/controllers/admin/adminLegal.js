const db = require("../../config/dbConfig");

/* -----------------------------------------
    AUTHORITY HANDLER: PUSH & DROP
----------------------------------------- */

// 1. PRIVACY POLICY: PUSH (ADD/UPDATE) & DROP
exports.pushPrivacyRule = async (req, res) => {
  const { id, serial_number, title, content } = req.body;
  try {
    if (id) {
      // UPDATE: Target specific independent rule
      const result = await db.query(
        'UPDATE privacy_policy SET serial_number = $1, title = $2, content = $3 WHERE id = $4 RETURNING *',
        [serial_number, title, content, id]
      );
      return res.status(200).json({ success: true, message: "PRIVACY NODE UPDATED", data: result.rows[0] });
    } else {
      // ADD: Commit brand new rule to the registry
      const result = await db.query(
        'INSERT INTO privacy_policy (serial_number, title, content) VALUES ($1, $2, $3) RETURNING *',
        [serial_number, title, content]
      );
      return res.status(201).json({ success: true, message: "NEW PRIVACY RULE COMMITTED", data: result.rows[0] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.dropPrivacyRule = async (req, res) => {
  const { id } = req.params;
  try {
    // DROP: Execute removal of a specific node
    await db.query('DELETE FROM privacy_policy WHERE id = $1', [id]);
    return res.status(200).json({ success: true, message: "PRIVACY RULE DROPPED" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. TERMS OF SERVICE: PUSH (ADD/UPDATE) & DROP
exports.pushTermsRule = async (req, res) => {
  const { id, serial_number, title, content } = req.body;
  try {
    if (id) {
      const result = await db.query(
        'UPDATE terms_of_service SET serial_number = $1, title = $2, content = $3 WHERE id = $4 RETURNING *',
        [serial_number, title, content, id]
      );
      return res.status(200).json({ success: true, message: "TERMS NODE UPDATED", data: result.rows[0] });
    } else {
      const result = await db.query(
        'INSERT INTO terms_of_service (serial_number, title, content) VALUES ($1, $2, $3) RETURNING *',
        [serial_number, title, content]
      );
      return res.status(201).json({ success: true, message: "NEW TERMS RULE COMMITTED", data: result.rows[0] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.dropTermsRule = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM terms_of_service WHERE id = $1', [id]);
    return res.status(200).json({ success: true, message: "TERMS RULE DROPPED" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. COOKIE POLICY: PUSH (ADD/UPDATE) & DROP
exports.pushCookieRule = async (req, res) => {
  const { id, serial_number, title, content } = req.body;
  try {
    if (id) {
      const result = await db.query(
        'UPDATE cookie_policy SET serial_number = $1, title = $2, content = $3 WHERE id = $4 RETURNING *',
        [serial_number, title, content, id]
      );
      return res.status(200).json({ success: true, message: "COOKIE NODE UPDATED", data: result.rows[0] });
    } else {
      const result = await db.query(
        'INSERT INTO cookie_policy (serial_number, title, content) VALUES ($1, $2, $3) RETURNING *',
        [serial_number, title, content]
      );
      return res.status(201).json({ success: true, message: "NEW COOKIE RULE COMMITTED", data: result.rows[0] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.dropCookieRule = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM cookie_policy WHERE id = $1', [id]);
    return res.status(200).json({ success: true, message: "COOKIE RULE DROPPED" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. FETCH ALL FOR ADMIN SYNC
exports.getAdminLegalRegistry = async (req, res) => {
  try {
    const privacy = await db.query('SELECT * FROM privacy_policy ORDER BY serial_number ASC');
    const terms = await db.query('SELECT * FROM terms_of_service ORDER BY serial_number ASC');
    const cookies = await db.query('SELECT * FROM cookie_policy ORDER BY serial_number ASC');
    
    return res.status(200).json({
      success: true,
      registry: {
        privacy: privacy.rows,
        terms: terms.rows,
        cookies: cookies.rows
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};