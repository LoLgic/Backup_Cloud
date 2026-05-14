import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({

  fileName: {
    type: String,
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  publicId: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null
  },

  isPublic: {
    type: Boolean,
    default: false
  },

  shareToken: {
    type: String,
    default: null
  },

}, {
  timestamps: true
});

const File = mongoose.model(
  "File",
  fileSchema
);

export default File;