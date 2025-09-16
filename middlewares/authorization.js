// middlewares/authorization.js
const Blog = require("../models/blog");

async function authorizeBlogOwnerOrAdmin(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    if (!blog) {
      req.flash("error_msg", "Blog not found.");
      return res.redirect("/");
    }

    // Only owner or admin can edit/delete
    if (blog.createdBy._id.toString() !== req.user._id.toString()) {
      req.flash("error_msg", "Not authorized.");
      return res.redirect("/");
    }

    req.blog = blog; 
    next();
  } catch (err) {
    console.error("Authorization error:", err);
    req.flash("error_msg", "Something went wrong.");
    return res.redirect("/");
  }
}

module.exports = { authorizeBlogOwnerOrAdmin };
