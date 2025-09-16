require("dotenv").config();
const express = require("express");
const path =require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

console.log("--- SERVER SCRIPT (v5 FINAL FIX) IS BEING READ BY NODE ---");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8002;

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- EJS SETUP ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------- CORE MIDDLEWARE -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // This is working correctly.
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));


// ------------------- THE FINAL FIX -------------------
// Replace the simple string with the more robust function version.
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
// ----------------------------------------------------


app.use(session({
  secret: "ShaanMaan23",
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(checkForAuthenticationCookie("token"));


// ------------------- GLOBAL VARIABLES MIDDLEWARE -------------------
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.user = req.user || null;
  next();
});


// ------------------- ROUTES -------------------
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 }).populate("createdBy");
  res.render("home", { blogs: allBlogs });
});

// ... (rest of file is the same)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "public/uploads")),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.post("/upload-image", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ location: `/uploads/${req.file.filename}` });
});

// ------------------- SERVER START -------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});