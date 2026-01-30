const pool = require('../../config/dbConfig');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const refreshToken = async (req, res) => {
  const client = await pool.connect();

  try {
    // ✅ Use same cookie name as loginUser
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.status(401).json({ authenticated: false, error: 'Session expired' });
    }

    // ✅ Hash to match stored session
    const refreshTokenHash = crypto.createHash('sha256').update(refresh_token).digest('hex');

    // ✅ Look up the session exactly like loginUser
    const sessionResult = await client.query(
      `SELECT s.id AS session_id, s.user_internal_id, u.user_id, u.role, u.account_status
       FROM user_sessions s
       JOIN users u ON u.id = s.user_internal_id
       WHERE s.refresh_token_hash = $1
         AND s.revoked = false`,
      [refreshTokenHash]
    );

    const session = sessionResult.rows[0];

    if (!session) {
      return res.status(401).json({ authenticated: false, error: 'Invalid session' });
    }

    // ✅ Only VERIFIED or ACTIVE users
    if (!['VERIFIED', 'ACTIVE'].includes(session.account_status)) {
      return res.status(403).json({ error: 'Account not active' });
    }

    // ✅ Generate access token exactly like loginUser
    const accessToken = jwt.sign(
      { userInternalId: session.user_internal_id, userId: session.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // ✅ Set cookie exactly like loginUser
    res.cookie('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      authenticated: true,
      user_id: session.user_id,
      role: [session.role] // matches loginUser structure
    });

  } catch (err) {
    console.error('🔥 Refresh token error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = { refreshToken };
