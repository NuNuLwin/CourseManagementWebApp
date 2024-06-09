const mongoose = require("mongoose");

const contentFileSchema = new mongoose.Schema(
  {
    length: { type: Number },
    chunkSize: { type: Number },
    uploadDate: { type: Date },
    filename: { type: String, trim: true, searchable: true },
    md5: { type: String, trim: true, searchable: true },
  },
  { collection: "content.files", id: false }
);

module.exports = mongoose.model("ContentFile", contentFileSchema);
