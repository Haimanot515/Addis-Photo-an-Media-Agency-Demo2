
const pool = require('../../config/dbConfig');

/* ───── AUTHORITY READ OPERATIONS ───── */

/**
 * 1. GET ALL USERS + SEARCH + TOTAL STATS
 */
exports.getUsers = async (req, res) => {
    const { search } = req.query;

    try {
        let listQuery = 'SELECT * FROM users';
        let params = [];

        if (search && search.trim() !== "" && search !== "undefined") {
            listQuery += ` 
                WHERE full_name ILIKE $1 
                OR email ILIKE $1 
                OR phone ILIKE $1 
                OR user_id ILIKE $1
                OR account_status ILIKE $1
            `;
            params.push(`%${search.trim()}%`);
        }

        listQuery += ' ORDER BY created_at DESC';
        
        const { rows: users } = await pool.query(listQuery, params);

        /**
         * UPDATED STATS QUERY
         * Added TRIM() to handle invisible spaces and UPPER() to ensure case-matching.
         * Using COALESCE to ensure we never return null to the frontend.
         */
        const statsQuery = `
            SELECT 
                COUNT(*)::INT as total,
                COUNT(*) FILTER (WHERE TRIM(UPPER(account_status)) = 'ACTIVE')::INT as active,
                COUNT(*) FILTER (WHERE TRIM(UPPER(account_status)) = 'PENDING')::INT as pending,
                COUNT(*) FILTER (WHERE TRIM(UPPER(account_status)) = 'SUSPENDED')::INT as suspended,
                COUNT(*) FILTER (WHERE TRIM(UPPER(role)) = 'ADMIN')::INT as admins
            FROM users
        `;
        const { rows: stats } = await pool.query(statsQuery);

        // Debug Log: Check your terminal to see exactly what the DB is saying
        console.log(`[DATABASE DEBUG] Found ${stats[0].admins} Admins out of ${stats[0].total} total nodes.`);

        res.status(200).json({
            success: true,
            stats: stats[0] || { total: 0, active: 0, pending: 0, suspended: 0, admins: 0 },
            data: users 
        });
    } catch (err) {
        console.error("REGISTRY FETCH ERROR:", err.message);
        res.status(500).json({ 
            success: false, 
            msg: "Deep registry read failed",
            error: err.message 
        });
    }
};

/* ───── AUTHORITY WRITE OPERATIONS (STATUS / ROLE / DROP) ───── */

exports.statusUser = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    try {
        await pool.query('UPDATE users SET account_status = $1 WHERE id = $2', [status, id]);
        res.status(200).json({ success: true, message: `REGISTRY UPDATE: Node status set to ${status}` });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Status update failure" });
    }
};

exports.roleUser = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; 
    try {
        // Enforce Uppercase on Save to prevent future 0-count issues
        await pool.query('UPDATE users SET role = UPPER($1) WHERE id = $2', [role, id]);
        res.status(200).json({ success: true, message: `REGISTRY UPDATE: Node role set to ${role}` });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Role change failure" });
    }
};

exports.verifyUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("UPDATE users SET account_status = 'ACTIVE', verification_attempts = 0 WHERE id = $1", [id]);
        res.status(200).json({ success: true, message: "REGISTRY UPDATE: Node verified manually" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Verification failure" });
    }
};

exports.dropUser = async (req, res) => {
    const { id } = req.params;
    try {
        // DROP: Permanent removal
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(200).json({ 
            success: true, 
            message: "REGISTRY DROP: Node permanently purged" 
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "DROP failure: " + err.message });
    }
};