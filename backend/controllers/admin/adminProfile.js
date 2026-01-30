const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* ───── HELPER: Supabase Identity PUSH ───── */
const uploadToSupabase = async (file, bucket, folder = 'profiles') => {
    if (!file) return null;
    const targetBucket = bucket.trim();
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

    console.log(`Commencing Identity PUSH to Supabase: ${targetBucket}/${filePath}`);

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

/* ───── AUTHORITY READ: Fetch Merged Identity ───── */
exports.getAdminProfile = async (req, res) => {
    try {
        // req.user.id is the internal serial ID from your authMiddleware
        const query = `
            SELECT 
                u.id, u.full_name, u.email, u.phone, u.photo_url, 
                p.job_title, p.location, p.updated_at
            FROM users u
            LEFT JOIN admin_profiles p ON u.id = p.user_internal_id
            WHERE u.id = $1
        `;
        const { rows } = await pool.query(query, [req.user.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found in registry" });
        }

        res.json({ success: true, profile: rows[0] });
    } catch (err) {
        console.error("FETCH ERROR:", err.message);
        res.status(500).json({ success: false, error: "Registry Sync Error" });
    }
};

/* ───── AUTHORITY WRITE: Atomic PUSH (Upsert) ───── */
exports.pushAdminProfile = async (req, res) => {
    const client = await pool.connect(); // Start client for Transaction
    try {
        const { full_name, email, phone, job_title, location } = req.body;
        const userId = req.user.id; 
        const file = req.file;

        await client.query('BEGIN'); // Start Transaction

        // 1. Handle Photo PUSH to Supabase if a new file is provided
        let photoUrl = null;
        if (file) {
            photoUrl = await uploadToSupabase(file, 'FarmerListing', 'profiles');
        }

        // 2. Update Core User Data (Auth Table)
        const userUpdateQuery = photoUrl 
            ? "UPDATE users SET full_name=$1, email=$2, phone=$3, photo_url=$4 WHERE id=$5"
            : "UPDATE users SET full_name=$1, email=$2, phone=$3 WHERE id=$4";
        
        const userParams = photoUrl 
            ? [full_name, email, phone, photoUrl, userId] 
            : [full_name, email, phone, userId];

        await client.query(userUpdateQuery, userParams);

        // 3. PUSH to Admin Profile Table (Metadata Table)
        // Uses ON CONFLICT to handle both first-time creation and subsequent updates
        const profileQuery = `
            INSERT INTO admin_profiles (user_internal_id, job_title, location, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (user_internal_id) 
            DO UPDATE SET 
                job_title = EXCLUDED.job_title, 
                location = EXCLUDED.location, 
                updated_at = NOW()
            RETURNING *;
        `;
        const { rows: profileRows } = await client.query(profileQuery, [userId, job_title, location]);

        await client.query('COMMIT'); // Commit both updates simultaneously

        res.json({
            success: true,
            message: "REGISTRY PUSH: Identity Node Synchronized",
            data: {
                ...profileRows[0],
                full_name,
                email,
                phone,
                photo_url: photoUrl || "unchanged"
            }
        });

    } catch (err) {
        await client.query('ROLLBACK'); // Cancel all changes if any step fails
        console.error("PUSH ERROR:", err.message);
        res.status(500).json({ success: false, error: "PUSH failure: " + err.message });
    } finally {
        client.release(); // Return client to the pool
    }
};