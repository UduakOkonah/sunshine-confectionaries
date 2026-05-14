const express = require("express");
const streamifier = require("streamifier");

const cloudinary = require("../config/cloudinary");

const upload = require("../middleware/uploadMiddleware");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "sunshine-confectionaries",
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      res.status(200).json({
        imageUrl: result.secure_url,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;