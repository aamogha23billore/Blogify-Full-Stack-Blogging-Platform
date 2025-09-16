const { Router } = require("express");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { authorizeBlogOwnerOrAdmin } = require("../middlewares/authorization");

// --- CLOUDINARY & MULTER SETUP ---
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogify-uploads",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

const upload = multer({ storage });
// --- END SETUP ---

const router = Router();


// --- ROUTES ---

// Show Add Blog Page
router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

// Create Blog
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageUrl: req.file.path, 
    });
    req.flash("success_msg", "Blog created successfully!"); // <-- ADDED
    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("❌ Error creating blog:", err);
    res.render("addBlog", {
        user: req.user,
        error: "Blog creation failed. Please try again." // This error shows immediately on the form
    });
  }
});

// View Blog + Comments
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  res.render("viewBlog", { user: req.user, blog, comments });
});

// Add Comment
router.post("/comment/:blogId", async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;
  if (content && content.trim() !== "") {
    await Comment.create({
      content: content,
      blogId: blogId,
      createdBy: req.user._id,
    });
  }
  return res.redirect(`/blog/${blogId}`);
});

// Edit Blog Page
router.get("/:id/edit", authorizeBlogOwnerOrAdmin, async (req, res) => {
  res.render("editBlog", { user: req.user, blog: req.blog });
});

// Update Blog
router.post("/update/:id", upload.single("coverImage"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      req.flash("error_msg", "Blog not found."); 
      return res.redirect("/");
    }
    if (blog.createdBy.toString() !== req.user._id.toString()) {
      req.flash("error_msg", "Not authorized."); 
      return res.redirect("/");
    }

    const { title, body } = req.body;
    blog.title = title;
    blog.body = body;

    if (req.file) {
      blog.coverImageUrl = req.file.path;
    }

    await blog.save();
    req.flash("success_msg", "Blog updated successfully.");
    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("❌ Error updating blog:", err);
    req.flash("error_msg", "Something went wrong during the update."); 
    res.redirect("/");
  }
});

// Delete Blog
router.delete("/:id", authorizeBlogOwnerOrAdmin, async (req, res) => {
  try {
    await req.blog.deleteOne();
    req.flash("success_msg", "Blog deleted successfully."); 
    res.redirect("/");
  } catch (err) {
    console.error("❌ Error deleting blog:", err);
    req.flash("error_msg", "Something went wrong while deleting the blog."); 
    res.redirect("/");
  }
});

module.exports = router;
