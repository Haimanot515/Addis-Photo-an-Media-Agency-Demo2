const db = require("../config/dbConfig.js");

// ✅ Fetch all posts from the 'blogs' database
exports.getAllPosts = async (req, res) => {
  try {
    const query = `
      SELECT id, title, slug, excerpt, created_at 
      FROM posts 
      ORDER BY created_at DESC;
    `;
    
    const result = await db.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Blog Fetch Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ ADDED: Fetch a single post by its slug
exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params; // Extracts slug from the URL: /api/posts/:slug

    const query = `
      SELECT id, user_internal_id, title, slug, content, excerpt, created_at
      FROM posts
      WHERE slug = $1;
    `;
    
    const result = await db.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Fetch Slug Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Create a new post (Admin only)
exports.createPost = async (req, res) => {
  try {
    const userInternalId = req.user.id; 
    const { title, slug, content, excerpt } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const query = `
      INSERT INTO posts (user_internal_id, title, slug, content, excerpt)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at;
    `;
    
    const values = [userInternalId, title.trim(), slug.trim(), content.trim(), excerpt || null];
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