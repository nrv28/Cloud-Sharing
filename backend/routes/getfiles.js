const express = require('express');
const router = express.Router();
const File = require('../models/fileSchema');
const authMiddleware = require('../middlewares/authMiddleware');


router.get("/files", authMiddleware, async (req, res) => {
    const files = await File.find({ userId: req.user.userId });
    res.json(files);
});


module.exports = router;