const db = require("../../config/dbConfig.js");
const supabase = require("../../config/supabase");

/* ───── HELPER: Supabase Image Upload ───── */
const uploadToSupabase = async (file, bucket, folder = 'team') => {
    if (!file) return null;

    const targetBucket = bucket.trim();
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

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

/* ───── AUTHORITY OPERATIONS ───── */

// 1. PUSH: Add a new Team Member
exports.addTeamMember = async (req, res) => {
    try {
        const { name, role, education, phone } = req.body;
        const file = req.file;

        if (!file || !name || !role) {
            return res.status(400).json({ success: false, message: "Name, Role, and Image are required." });
        }

        // Upload image to 'FarmerListing' bucket under 'team' folder
        const imageUrl = await uploadToSupabase(file, 'FarmerListing', 'team');

        const query = `
            INSERT INTO team (name, role, education, phone, image)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const { rows } = await db.query(query, [name, role, education, phone, imageUrl]);

        res.status(201).json({
            success: true,
            message: "REGISTRY PUSH: Team member added.",
            data: rows[0]
        });
    } catch (err) {
        console.error("Team Push Error:", err.message);
        res.status(500).json({ success: false, error: "PUSH failure: " + err.message });
    }
};

// 2. DROP: Delete a Team Member
exports.deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify existence
        const { rowCount } = await db.query("SELECT id FROM team WHERE id = $1", [id]);
        if (rowCount === 0) {
            return res.status(404).json({ success: false, message: "Member not found in registry." });
        }

        // DROP from database
        await db.query("DELETE FROM team WHERE id = $1", [id]);

        res.json({
            success: true,
            message: "REGISTRY DROP: Member purged successfully."
        });
    } catch (err) {
        console.error("Team Drop Error:", err.message);
        res.status(500).json({ success: false, error: "DROP failure: " + err.message });
    }
};