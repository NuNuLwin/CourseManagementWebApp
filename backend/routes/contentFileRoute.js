const express = require("express");
const multer = require("multer");
const {
  uploadContentFile,
  viewContentFile,
} = require("../controllers/contentFileController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/").post(upload.single("file"), uploadContentFile);
router.route("/:id").get(viewContentFile);

module.exports = router;
