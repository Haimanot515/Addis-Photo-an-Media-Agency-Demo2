const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* ───── HELPER: Supabase Image Upload (Identical Logic) ───── */
const uploadToSupabase = async (file, bucket, folder = 'portfolio') => {
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

exports.getAllPortfolioItems = async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM portfolio ORDER BY created_at DESC"
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("FETCH ERROR:", err.message);
        res.status(500).json({ success: false, error: "Registry Fetch Error" });
    }
};

/* ───── AUTHORITY WRITE OPERATIONS (PUSH / DROP) ───── */

// 1. PUSH: Add a new work to the portfolio registry
exports.addPortfolioItem = async (req, res) => {
    try {
        const { alt } = req.body;
        const file = req.file;

        if (!file || !alt) {
            return res.status(400).json({ success: false, message: "Missing image or alt text" });
        }

        // Using identical bucket: 'FarmerListing' | folder: 'portfolio'
        const publicUrl = await uploadToSupabase(file, 'FarmerListing', 'portfolio');

        // Commit to Neon Database
        const query = `
            INSERT INTO portfolio (src, alt) 
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
        res.status(500).json({ success: false, error: "PUSH failure: " + err.message });
    }
};

// 2. DROP: Delete a work from the portfolio registry
exports.dropPortfolioItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify Node existence in registry
        const { rowCount } = await pool.query("SELECT id FROM portfolio WHERE id = $1", [id]);

        if (rowCount === 0) {
            return res.status(404).json({ success: false, message: "Node not found in registry" });
        }

        // DROP from Neon Database
        await pool.query("DELETE FROM portfolio WHERE id = $1", [id]);

        res.json({
            success: true,
            message: "REGISTRY DROP: Node permanently deleted"
        });

    } catch (err) {
        console.error("DROP ERROR:", err.message);
        res.status(500).json({ success: false, error: "DROP failure: " + err.message });
    }
};