const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    target: { type: String },
    title: { type: String },
    employeeId: { type: String },
    employeeName: { type: String },
    position: { type: String },
    noticeType: { type: String },
    publishDate: { type: Date },
    noticeBody: { type: String },
    attachmentName: { type: String },
    attachmentPath: { type: String },
    status: { type: String, default: "Unpublished" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
