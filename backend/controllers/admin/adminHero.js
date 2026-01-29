const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* ───── HELPER: Supabase Image Upload (Identical Logic) ───── */
const uploadToSupabase = async (file, bucket, folder = 'hero') => {
    if (!file) return null;
    const targetBucket = bucket.trim();
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

    console.log(`Commencing PUSH to Supabase: ${targetBucket}/${filePath}`);

    const { data, error } = await supabase.storage
        .from(targetBucket)
        .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(targetBucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

/* ───── AUTHORITY OPERATIONS ───── */

// 1. READ: Get current Hero Node
exports.getHeroData = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM hero LIMIT 1");
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Fetch failure: " + err.message });
    }
};

// 2. PUSH: Update Hero Section (Commit Changes)
exports.updateHeroData = async (req, res) => {
    try {
        const { hero_title, hero_subtitle, hero_marquee } = req.body;
        const file = req.file;

        let imageUrl = req.body.hero_bg; // Keep old URL if no new file

        if (file) {
            imageUrl = await uploadToSupabase(file, 'FarmerListing', 'hero_assets');
        }

        const query = `
            UPDATE hero 
            SET hero_bg = $1, hero_title = $2, hero_subtitle = $3, hero_marquee = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = (SELECT id FROM hero LIMIT 1)
            RETURNING *;
        `;
        
        const { rows } = await pool.query(query, [imageUrl, hero_title, hero_subtitle, hero_marquee]);

        res.status(200).json({
            success: true,
            message: "REGISTRY PUSH: Hero Node Updated",
            data: rows[0]
        });
    } catch (err) {
        console.error("PUSH ERROR:", err.message);
        res.status(500).json({ success: false, error: "PUSH failure: " + err.message });
    }
};