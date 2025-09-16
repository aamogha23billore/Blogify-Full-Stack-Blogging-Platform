Blogify is a dynamic and responsive full-stack web application that allows users to create, manage, and share their own blogs. It features a complete authentication system, CRUD functionality for blog posts, image uploads, and a commenting system.

✨ Key Features:-

🔐 Full User Authentication: Secure user sign-up and sign-in functionality using jwt authentication and password hashing.
📝 Complete Blog Management (CRUD):
Create: Users can write new blog posts using a rich-text editor.
Read: A public feed of all blogs and a detailed view for each individual post.
Update: Users can edit their own blog posts.
Delete: Users can delete their own blog posts.
🖼️ Image Uploads: Seamlessly upload a cover image for each blog post using Multer.
💬 Commenting System: Logged-in users can leave comments on blog posts.
🛡️ Authorization: Robust middleware ensures that users can only edit or delete their own posts.
📱 Responsive Design: A clean and modern UI built with Bootstrap that works on all screen sizes.
📢 Flash Notifications: User-friendly feedback for actions like successful login, post deletion, or errors.

🔧 Tech Stack
🖥️ Backend:
Node.js: JavaScript runtime environment.
Express.js: Web application framework for Node.js.
🗃️ Database:
MongoDB: NoSQL database for storing user and blog data.
Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.
🎨 Frontend / Templating:
EJS (Embedded JavaScript): Templating engine to generate dynamic HTML.
Bootstrap 5: CSS framework for responsive and modern design.
⚙️ Key Libraries & Middleware:
multer: Middleware for handling multipart/form-data, used for file uploads.
bcrypt: Library for hashing user passwords.
cookie-parser & express-session: For managing user sessions.
connect-flash: Middleware for displaying flash messages.
method-override: For using HTTP verbs like PUT and DELETE in HTML forms.
dotenv: For managing environment variables.
