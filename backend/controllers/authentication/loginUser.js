const pool = require('../../config/dbConfig');
const bcrypt = require('bcryptjs'); // ✅ Fixed: Changed from 'bcrypt' to 'bcryptjs'
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios'); 
const { logAudit } = require('../../utils/auditLogger');
const { checkRateLimit } = require('../../utils/rateLimiter');

const normalizePhone = (phone) => {
  let p = phone.replace(/\s+/g, '');
  if (p.startsWith('0')) p = '+251' + p.slice(1);
  if (p.startsWith('251')) p = '+' + p;
  return p;
};

const loginUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { identifier, password, captchaToken } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email or phone and password are required' });
    }

    // --- reCAPTCHA (Commented out for testing) ---
    /*
    if (!captchaToken) return res.status(400).json({ error: 'Security check required.' });
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
    const captchaRes = await axios.post(verifyUrl);
    if (!captchaRes.data.success) return res.status(400).json({ error: 'Invalid security token. Please try again.' });
    */

    // --- Rate Limiting ---
    const allowed = await checkRateLimit({
      ipKey: `login:ip:${ipAddress}`,
      userKey: `login:user:${identifier}`,
      ipLimit: 20,
      userLimit: 10
    });
    if (!allowed) return res.status(429).json({ error: 'Too many attempts.' });

    const normalizedIdentifier = identifier.includes('@') ? identifier : normalizePhone(identifier);

    // --- Fetch User ---
    const { rows } = await client.query(
      `SELECT id, user_id, password_hash, account_status, role FROM users WHERE email=$1 OR phone=$1`,
      [normalizedIdentifier]
    );
    const user = rows[0];

    // --- Password Check ---
    const isValid = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!user || !isValid) {
      if (user) await logAudit({ userId: user.id, status: 'FAILED', method: 'LOGIN', ipAddress, userAgent });
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // --- Account Status Check ---
    if (!['VERIFIED', 'ACTIVE'].includes(user.account_status)) {
      return res.status(403).json({ error: 'Account not verified. Please verify first.' });
    }

    // --- Tokens ---
    const accessToken = jwt.sign(
      { userInternalId: user.id, userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // --- Store Session ---
    await client.query(
      `INSERT INTO user_sessions (user_internal_id, refresh_token_hash, ip_address, user_agent)
       VALUES ($1, $2, $3, $4)`,
      [user.id, refreshTokenHash, ipAddress, userAgent]
    );

    // --- Set Cookies ---
    res.cookie('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // --- Log & Respond ---
    await logAudit({ userId: user.id, status: 'SUCCESS', method: 'LOGIN', ipAddress, userAgent });

    // ✅ Wrap role in an array to match frontend expectations
    return res.status(200).json({
      message: 'Login successful',
      authenticated: true,
      user_id: user.user_id,
      role: [user.role] // <-- Only change here
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = { loginUser };
