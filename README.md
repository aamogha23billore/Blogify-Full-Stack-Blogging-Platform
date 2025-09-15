# Blogify-Full-Stack-Blogging-Platform
A full-stack blogging application built with Node.js, Express, MongoDB, EJS, and authentication system.
Users can create, edit, and view blogs, upload cover images, add images inside the blog body (via Quill editor), and leave comments.

🚀 Features

🔐 Authentication & Authorization
Secure signup/login with password hashing (bcrypt).
Session maintained with cookies & JWT.

📝 Blog Management
Create blogs with title, body, and cover image.
Rich text editor (Quill) for blog body → allows text + inline images.
View blogs with clean, responsive UI.

💬 Comments Section
Authenticated users can post comments.
Displays commenter name + profile picture.

📷 Image Handling
Cover images uploaded with Multer.
Inline images in blog body stored in public/uploads/.

⏱️ Timestamps
Blogs & comments have automatic createdAt/updatedAt timestamps.

🛠️ Tech Stack

Frontend: EJS, Bootstrap 5, Quill.js
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ODM)
Authentication: JWT + Cookies, bcrypt password hashing
File Uploads: Multer
