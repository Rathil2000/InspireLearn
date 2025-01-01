const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// Importing routes
const userRoutes = require("./routes/userRoutes");
const userLoginRoute = require("./routes/userLoginRoute");
const adminLoginRoute = require("./routes/adminLoginRoute");
const adminRoutes = require("./routes/adminRoutes");
const teacherRoutes = require("./routes/teacherRoute");
const playlistRoutes = require("./routes/playlistRoute");
const courseRoutes = require("./routes/courseRoute");
const contactRoutes = require("./routes/contactRoute");
const favoriteRoutes = require("./routes/favoritePlaylistRoute");
const updateProfileRoutes = require("./routes/updateProfileRoute");

const app = express();
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Match Vite's default port
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Routes
app.use("/", userRoutes);
app.use("/", userLoginRoute);
app.use("/", adminLoginRoute);
app.use("/", adminRoutes);
app.use("/", teacherRoutes);
app.use("/", updateProfileRoutes);
app.use("/", playlistRoutes);
app.use("/", courseRoutes);
app.use("/", favoriteRoutes);
app.use(contactRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb+srv://Rathil:cJe6U7k0m1qfR6AW@cluster0.fibw1dl.mongodb.net/project")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});
port=process.env.PORT
// Start Server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
