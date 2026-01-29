const db = require("../../config/dbConfig.js");
const supabase = require("../../config/supabase.js");

// ✅ Fetch all posts
exports.getAllPosts = async (req, res) => {
  try {
    const query = `
      SELECT id, title, slug, excerpt, image_url, created_at 
      FROM posts 
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Blog Fetch Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Fetch a single post by slug
exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const query = `
      SELECT id, user_internal_id, title, slug, content, excerpt, image_url, created_at
      FROM posts
      WHERE slug = $1;
    `;
    const result = await db.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }
    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Fetch Slug Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Create a new post (Admin only) - Image Optional
exports.createPost = async (req, res) => {
  try {
    const userInternalId = req.user.id; 
    const { title, slug, content, excerpt } = req.body;
    const file = req.file;
    let imageUrl = null;

    if (!title || !slug || !content) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Handle Optional Image Upload
    if (file) {
      const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('FarmerListing')
        .upload(`blog/${fileName}`, file.buffer, { contentType: file.mimetype });

      if (error) throw error;
      const { data: urlData } = supabase.storage.from('FarmerListing').getPublicUrl(`blog/${fileName}`);
      imageUrl = urlData.publicUrl;
    }

    const query = `
      INSERT INTO posts (user_internal_id, title, slug, content, excerpt, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at;
    `;
    
    const values = [userInternalId, title.trim(), slug.trim(), content.trim(), excerpt || null, imageUrl];
    const result = await db.query(query, values);

    return res.status(201).json({
      success: true,
      message: "Post created!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Post Creation Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ DROP: Delete Post
exports.dropPost = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM posts WHERE id = $1 RETURNING *;`;
    const result = await db.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }
    res.status(200).json({ success: true, message: "REGISTRY DROP: Post purged." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};