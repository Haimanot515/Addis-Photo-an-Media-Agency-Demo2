const pool = require('../../config/dbConfig');
const { sendEmail } = require('../../config/smsConfig');

// 👑 GET ALL MESSAGES
exports.getAllMessages = async (req, res) => {
  try {
    const query = `
      SELECT c.*, u.full_name as registered_name 
      FROM contacts c
      LEFT JOIN users u ON c.user_internal_id = u.id
      ORDER BY c.created_at ASC;
    `;
    const result = await pool.query(query);
    return res.status(200).json({ success: true, registry: result.rows });
  } catch (err) {
    console.error('REGISTRY_FETCH_ERROR:', err);
    return res.status(500).json({ error: 'FAILED_TO_FETCH_REGISTRY' });
  }
};

// 👑 REPLY VIA EMAIL & PERSIST TO DB
exports.replyToMessage = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, messageId, replyText, name, user_internal_id } = req.body;

    if (!email || !replyText) {
      return res.status(400).json({ error: 'Target email and reply text are required.' });
    }

    await client.query('BEGIN');

    // Note: If 'role' doesn't exist in your table, we must remove it from here too.
    // I am removing 'role' from the INSERT to prevent this from crashing as well.
    const insertQuery = `
      INSERT INTO contacts (user_internal_id, name, email, message, is_read, created_at)
      VALUES ($1, $2, $3, $4, true, NOW())
      RETURNING *;
    `;
    const dbRes = await client.query(insertQuery, [
      user_internal_id || null, 
      'Admin', 
      email, 
      replyText
    ]);

    const newMessage = dbRes.rows[0];

    await sendEmail(
      email, 
      `RE: Support Inquiry #${messageId}`, 
      `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0088cc;">Hello ${name},</h2>
          <p>Thank you for contacting our support team. Here is our response to your inquiry:</p>
          <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #0088cc; margin: 20px 0;">
            ${replyText}
          </div>
          <p style="font-size: 12px; color: #64748b;">Reference ID: ${messageId}</p>
        </div>
      `
    );

    await client.query('COMMIT');

    return res.status(200).json({ 
      success: true, 
      message: 'Reply transmitted and persisted.',
      newMessage 
    });

  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('🔥 REPLY_ERROR:', err.message);
    return res.status(500).json({ error: 'Internal Server Error during reply transmission.' });
  } finally {
    client.release();
  }
};

// 👑 MARK MESSAGES AS READ (Fixed: Removed non-existent 'role' column)
exports.markMessagesRead = async (req, res) => {
  const { email } = req.body;
  
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Removed 'AND role != admin' because that column does not exist in your DB
    const query = `
      UPDATE contacts 
      SET is_read = true 
      WHERE email = $1 
      AND is_read = false;
    `;
    const result = await pool.query(query, [email]);
    
    return res.status(200).json({ 
      success: true, 
      message: 'THREAD_MARKED_READ',
      updatedCount: result.rowCount 
    });
  } catch (err) {
    console.error('DATABASE_UPDATE_ERROR:', err.message);
    return res.status(500).json({ error: 'FAILED_TO_UPDATE_READ_STATUS' });
  }
};

// 👑 DROP MESSAGE NODE
exports.dropMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'NODE_NOT_FOUND' });
    }
    return res.status(200).json({ success: true, message: 'NODE_DROPPED' });
  } catch (err) {
    console.error('DROP_EXECUTION_ERROR:', err);
    return res.status(500).json({ error: 'DROP_FAILED' });
  }
};