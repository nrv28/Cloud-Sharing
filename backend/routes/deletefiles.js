const express = require("express");
const cloudinary = require("../config/cloudinary.js");
const File = require("../models/fileSchema.js");

const router = express.Router();

router.delete("/file/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    await cloudinary.uploader.destroy(file.cloudinary_id);
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
});

module.exports=router;
