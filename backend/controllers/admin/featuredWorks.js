const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* ───── HELPER: Supabase Image Upload ───── */
const uploadToSupabase = async (file, bucket, folder = 'features') => {
    if (!file) return null;

    // Use .trim() to ensure no hidden spaces in the bucket name cause a 404
    const targetBucket = bucket.trim();
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

    // Log for debugging terminal
    console.log(`Commencing PUSH to Supabase: ${targetBucket}/${filePath}`);

    const { data, error } = await supabase.storage
        .from(targetBucket)
        .upload(filePath, file.buffer, { 
            contentType: file.mimetype, 
            upsert: false 
        });

    if (error) {
        console.error("Supabase Storage Error:", error);
        throw error;
    }

    const { data: urlData } = supabase.storage.from(targetBucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

/* ───── AUTHORITY READ OPERATIONS ───── */

exports.getAllFeatures = async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM features ORDER BY created_at DESC"
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("FETCH ERROR:", err.message);
        res.status(500).json({ success: false, error: "Registry Fetch Error" });
    }
};

/* ───── AUTHORITY WRITE OPERATIONS (PUSH / DROP) ───── */

// 1. PUSH: Add a new featured work to the portfolio
exports.addFeaturedWork = async (req, res) => {
    try {
        const { alt } = req.body;
        const file = req.file;

        if (!file || !alt) {
            return res.status(400).json({ success: false, message: "Missing image or alt text" });
        }

        // Using your exact bucket name: 'FarmerListing'
        const publicUrl = await uploadToSupabase(file, 'FarmerListing', 'portfolio');

        // Commit to Neon Database
        const query = `
            INSERT INTO features (src, alt) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [publicUrl, alt]);

        res.status(201).json({
            success: true,
            message: "REGISTRY PUSH: Node Created",
            data: rows[0]
        });

    } catch (err) {
        console.error("PUSH ERROR:", err.message);
        // Error message fixed to say PUSH failure instead of DROP
        res.status(500).json({ success: false, error: "PUSH failure: " + err.message });
    }
};

// 2. DROP: Delete a featured work from the registry
exports.dropFeaturedWork = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify Node existence in registry
        const { rowCount } = await pool.query("SELECT id FROM features WHERE id = $1", [id]);

        if (rowCount === 0) {
            return res.status(404).json({ success: false, message: "Node not found in registry" });
        }

        // DROP from Neon Database
        await pool.query("DELETE FROM features WHERE id = $1", [id]);

        res.json({
            success: true,
            message: "REGISTRY DROP: Node permanently deleted"
        });

    } catch (err) {
        console.error("DROP ERROR:", err.message);
        res.status(500).json({ success: false, error: "DROP failure: " + err.message });
    }
};