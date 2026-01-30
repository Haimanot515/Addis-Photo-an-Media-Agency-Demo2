const pool = require('../config/dbConfig');
const supabase = require('../config/supabase');

/* ───── HELPER: Supabase Identity PUSH ───── */
const uploadToSupabase = async (file, bucket, folder = 'user_profiles') => {
    if (!file) return null;
    const targetBucket = bucket.trim();
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

    console.log(`Commencing User PUSH to Supabase: ${targetBucket}/${filePath}`);

    const { data, error } = await supabase.storage
        .from(targetBucket)
        .upload(filePath, file.buffer, { 
            contentType: file.mimetype, 
            upsert: false 
        });

    if (error) throw error;
    
    const { data: urlData } = supabase.storage.from(targetBucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

/* ───── IDENTITY READ: Fetch Current User Info ───── */
exports.getUserProfile = async (req, res) => {
    try {
        // req.user.id is extracted from your session/JWT middleware
        const query = `
            SELECT id, user_id, full_name, email, phone, photo_url, role, created_at 
            FROM users 
            WHERE id = $1
        `;
        const { rows } = await pool.query(query, [req.user.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, profile: rows[0] });
    } catch (err) {
        console.error("FETCH_USER_ERROR:", err.message);
        res.status(500).json({ success: false, error: "Identity Sync Error" });
    }
};

/* ───── IDENTITY WRITE: Update User Info (PUSH) ───── */
exports.updateUserProfile = async (req, res) => {
    try {
        const { full_name, email, phone } = req.body;
        const userId = req.user.id; 
        const file = req.file;

        // 1. Handle Photo PUSH to Supabase if a new file is provided
        let photoUrl = null;
        if (file) {
            photoUrl = await uploadToSupabase(file, 'FarmerListing', 'user_profiles');
        }

        // 2. UPDATE Core User Table
        // We use COALESCE or conditional logic to only update photo if provided
        let query;
        let params;

        if (photoUrl) {
            query = `
                UPDATE users 
                SET full_name = $1, email = $2, phone = $3, photo_url = $4 
                WHERE id = $5 
                RETURNING id, full_name, email, phone, photo_url;
            `;
            params = [full_name, email, phone, photoUrl, userId];
        } else {
            query = `
                UPDATE users 
                SET full_name = $1, email = $2, phone = $3 
                WHERE id = $4 
                RETURNING id, full_name, email, phone, photo_url;
            `;
            params = [full_name, email, phone, userId];
        }

        const { rows } = await pool.query(query, params);

        res.json({
            success: true,
            message: "IDENTITY PUSH: User profile synchronized",
            data: rows[0]
        });

    } catch (err) {
        console.error("UPDATE_USER_ERROR:", err.message);
        res.status(500).json({ success: false, error: "Update failure: " + err.message });
    }
};