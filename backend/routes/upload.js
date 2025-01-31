const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); 
const File = require("../models/fileSchema"); 
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: "file_sharing", 
    format: file.mimetype.split("/")[1], 
    public_id: file.originalname.split(".")[0], 
    resource_type: "auto", 
  }),
});

const upload = multer({ storage: storage });

// File Upload Route
router.post("/upload", authMiddleware ,upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const fileData = new File({
      filename: req.file.originalname,
      url: req.file.path, 
      cloudinary_id: req.file.filename, 
      userId: req.user.userId, 
    });

    await fileData.save(); 

    res.json({
      message: "File uploaded successfully",
      url: req.file.path, 
      fileId: fileData._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File upload failed", error });
  }
});

module.exports = router;
