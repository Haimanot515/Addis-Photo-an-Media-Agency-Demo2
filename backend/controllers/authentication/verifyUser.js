const pool = require('../../config/dbConfig');
const jwt = require('jsonwebtoken');

const verifyUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ error: 'Verification token missing' });

    // 1️⃣ Decode verification JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Verification link expired or invalid' });
    }

    // 2️⃣ Lookup user by numeric internal ID (from registration token)
    const { rows } = await pool.query(
      `SELECT id, user_id, account_status 
       FROM users 
       WHERE id = $1`,
      [decoded.numericId]
    );

    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];

    // 3️⃣ Check if already verified
    if (user.account_status === 'VERIFIED' || user.account_status === 'ACTIVE') {
      return res.status(200).json({ message: 'Account already verified', user_id: user.user_id });
    }

    // 4️⃣ Update account status in DB
    await pool.query(
      `UPDATE users 
       SET account_status='VERIFIED',
           verification_code_hash=NULL, 
           verification_attempts=0, 
           verification_used_at=NOW() 
       WHERE id=$1`,
      [user.id]
    );

    // 5️⃣ Issue auth JWT
    const authToken = jwt.sign(
      {
        userInternalId: user.id,
        userId: user.user_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6️⃣ Set auth cookie
    res.cookie('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // 7️⃣ Respond success
    return res.status(200).json({
      message: 'Account verified successfully',
      authenticated: true,
      user_id: user.user_id,
      next: 'HOME'
    });

  } catch (err) {
    console.error('Verify user error:', err.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { verifyUser };
