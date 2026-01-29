const { v4: uuidv4 } = require('uuid');
const pool = require('../../config/dbConfig');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../config/smsConfig');

exports.registerUser = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      full_name, phone, email, password,
      preferred_method, 
      all_consents_accepted
    } = req.body;

    // --- 1. PRE-CHECK VALIDATION ---
    if (preferred_method === 'EMAIL' && (!email || email.trim() === "")) {
      return res.status(400).json({ error: 'Email is required for Email verification.' });
    }

    if (!phone || phone.trim() === "") {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    // --- 2. NORMALIZE INPUTS ---
    let normalizedPhone = phone.replace(/\s+/g, '');
    if (normalizedPhone.startsWith('0')) normalizedPhone = '+251' + normalizedPhone.slice(1);

    const cleanEmail = email?.trim() ? email.trim().toLowerCase() : null;

    await client.query('BEGIN');

    // --- 3. DUPLICATE CHECKS ---
    const phoneExists = await client.query('SELECT 1 FROM users WHERE phone = $1', [normalizedPhone]);
    if (phoneExists.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'This phone number is already registered.' });
    }

    if (cleanEmail) {
      const emailExists = await client.query('SELECT 1 FROM users WHERE email = $1', [cleanEmail]);
      if (emailExists.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'This email is already registered.' });
      }
    }

    // --- 4. HASH PASSWORD ---
    const password_hash = await bcrypt.hash(password, 12);

    // --- 5. INSERT USER ---
    const insertUser = await client.query(
      `INSERT INTO users (
        user_id, full_name, phone, email, password_hash,
        account_status, verification_method,
        terms_accepted, general_consented_at,
        consent_ip, consent_user_agent
      )
      VALUES ($1, $2, $3, $4, $5, 'PENDING', $6, $7, NOW(), $8, $9)
      RETURNING id, user_id`,
      [
        `USR-${uuidv4().substring(0, 8).toUpperCase()}`,
        full_name, 
        normalizedPhone, 
        cleanEmail,
        password_hash,
        preferred_method || 'SMS', 
        all_consents_accepted || false,
        req.ip, 
        req.headers['user-agent']
      ]
    );

    const userInternalId = insertUser.rows[0].id;

    // --- 6. CREATE VERIFICATION TOKEN ---
    const verificationToken = jwt.sign(
      { email: cleanEmail, numericId: userInternalId }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    await client.query(
      `UPDATE users SET verification_code_hash = $1, verification_expires = NOW() + INTERVAL '24 hours' WHERE id = $2`,
      [verificationToken, userInternalId]
    );

    await client.query('COMMIT');

    // --- 7. SEND VERIFICATION EMAIL IF REQUIRED ---
    if (preferred_method?.toUpperCase() === 'EMAIL' && cleanEmail) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

      sendEmail(
        cleanEmail, 
        'Verify Your Agency Account', 
        `<p>Click below to verify your account:</p><a href="${verificationLink}">${verificationLink}</a>`
      ).catch(err => console.error('📧 Email Error:', err));
    }

    return res.status(201).json({ 
      message: 'Registration successful.',
      user_id: insertUser.rows[0].user_id 
    });

  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('🔥 DATABASE ERROR:', err.detail || err.message); 
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
