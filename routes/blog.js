const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { authorizeBlogOwnerOrAdmin } = require("../middlewares/authorization");

const router = Router();

// MULTER SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ROUTES

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
      coverImageUrl: `/uploads/${req.file.filename}`,
    });
    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("❌ Error creating blog:", err);
    res.status(500).send("Something went wrong");
  }
});

// View Blog + Comments
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  res.render("viewBlog", { user: req.user, blog, comments });
});

// Add Comment
// Add Comment
router.post("/comment/:blogId", async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;

  // Check if the content is not empty BEFORE creating a comment
  if (content && content.trim() !== "") {
    // Only create a comment if there is actual content
    await Comment.create({
      content: content,
      blogId: blogId,
      createdBy: req.user._id,
    });
  }

  // Always redirect back, whether a comment was created or not
  return res.redirect(`/blog/${blogId}`);
});

// Edit Blog Page
router.get("/:id/edit", authorizeBlogOwnerOrAdmin, async (req, res) => {
  res.render("editBlog", { user: req.user, blog: req.blog });
});


// ------------------- THE FINAL FIX -------------------
// THIS IS THE NEW, CORRECT ROUTE FOR UPDATING A BLOG
router.post("/update/:id", upload.single("coverImage"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        req.flash("error_msg", "Blog not found.");
        return res.redirect("/");
    }

    // Manual authorization check since the middleware might not match "/update/:id"
    if (blog.createdBy.toString() !== req.user._id.toString()) {
      req.flash("error_msg", "Not authorized.");
      return res.redirect("/");
    }

    const { title, body } = req.body;
    blog.title = title;
    blog.body = body;

    if (req.file) {
      blog.coverImageUrl = `/uploads/${req.file.filename}`;
    }

    await blog.save();
    req.flash("success_msg", "Blog updated successfully.");
    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("❌ Error updating blog:", err);
    res.status(500).send("Something went wrong");
  }
});
// ----------------------------------------------------


// Delete Blog
router.delete("/:id", authorizeBlogOwnerOrAdmin, async (req, res) => {
  try {
    await req.blog.deleteOne();
    req.flash("success_msg", "Blog deleted successfully.");
    res.redirect("/");
  } catch (err) {
    console.error("❌ Error deleting blog:", err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;