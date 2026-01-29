const db = require("../../config/dbConfig.js");
const supabase = require("../../config/supabase.js");

// 🟢 INDEPENDENT READ
exports.getAdminServices = async (req, res) => {
    try {
        const query = `SELECT * FROM services ORDER BY id ASC;`;
        const result = await db.query(query);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🟢 INDEPENDENT PUSH
exports.pushService = async (req, res) => {
    try {
        const { title, description } = req.body;
        const file = req.file;
        let imageUrl = null;

        // ✅ Image is now optional: only upload if file exists
        if (file) {
            const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
            const { data, error } = await supabase.storage
                .from('FarmerListing')
                .upload(`services/${fileName}`, file.buffer, { contentType: file.mimetype });

            if (error) throw error;
            const { data: urlData } = supabase.storage.from('FarmerListing').getPublicUrl(`services/${fileName}`);
            imageUrl = urlData.publicUrl;
        }

        const query = `
            INSERT INTO services (title, description, image_url) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const result = await db.query(query, [title, description, imageUrl]);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("SERVICE PUSH ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🟢 INDEPENDENT DROP
exports.dropService = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM services WHERE id = $1 RETURNING *;`;
        const result = await db.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Node not found." });
        }
        res.status(200).json({ success: true, message: "REGISTRY DROP: Service purged." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};