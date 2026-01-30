const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

// Public Route Imports
const contactRoutes = require("./routes/contactRoutes.js");
const authRoutes = require("./routes/auth/userAuth");
const blogRoutes = require("./routes/blogRoutes.js");
const teamRoutes = require("./routes/teamRoutes.js");
const portfolioRoutes = require("./routes/portfolioRoutes.js"); 
const servicesRoutes = require("./routes/servicesRoutes.js"); 
const aboutRoutes = require("./routes/aboutRoutes.js");
const homeRoutes = require("./routes/homeRoutes.js"); 
const legalRoutes = require("./routes/legalRoutes.js");
const userProfileRoutes = require("./routes/userProfileRoutes"); 

// Admin Authority Route Imports
const adminFeaturesRoutes = require("./routes/admin/adminFeaturesRoutes.js"); 
const adminTeamRoutes = require("./routes/admin/adminTeamRoutes");
const adminPortfolioRoutes = require("./routes/admin/adminPortfolioRoutes");
const adminHeroRoutes = require("./routes/admin/adminHeroRoutes");
const adminServicesRoutes = require("./routes/admin/adminServicesRoutes"); 
const adminBlogRoutes = require("./routes/admin/adminBlog");
const usersRoutes = require('./routes/admin/adminUsersRoutes');
const adminContactRoutes = require("./routes/admin/adminContactRoutes");
const adminLegalRoutes = require("./routes/admin/adminLegalRoutes"); 
const adminProfileRoutes = require("./routes/admin/adminProfileRoutes"); 

dotenv.config();

const app = express();

/* -----------------------------------------
    TRUST PROXY & CORS
----------------------------------------- */
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* -----------------------------------------
    MIDDLEWARE
----------------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "images")));

/* -----------------------------------------
    ROUTES MOUNTING
----------------------------------------- */

// 🔓 PUBLIC / PROTECTED ENDPOINTS
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/posts", blogRoutes);
app.use("/api/portfolio", portfolioRoutes); 
app.use("/api/team", teamRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/legal", legalRoutes); 
app.use("/api/services", servicesRoutes);

// ✅ MOUNTED AT /api/user 
// This allows your router's "/profile" path to combine into "/api/user/profile"
app.use("/api/user", userProfileRoutes); 

// 👑 ADMIN AUTHORITY ENDPOINTS
app.use("/api/admin/features", adminFeaturesRoutes);
app.use("/api/admin/team", adminTeamRoutes);
app.use("/api/admin/portfolio", adminPortfolioRoutes);
app.use("/api/admin/hero", adminHeroRoutes);
app.use("/api/admin/services", adminServicesRoutes); 
app.use("/api/admin/blog", adminBlogRoutes);
app.use('/api/admin/users', usersRoutes);
app.use("/api/admin/messages", adminContactRoutes);
app.use("/api/admin/legal", adminLegalRoutes); 
app.use("/api/admin/profile", adminProfileRoutes); 

/* -----------------------------------------
    ERROR HANDLING
----------------------------------------- */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error("Critical Error:", err.message);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

/* -----------------------------------------
    START SERVER
----------------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Authority Server running at http://localhost:${PORT}`);
});