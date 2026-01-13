const express = require("express");
const path = require("path");
const multer = require("multer");
const Notice = require("../models/Notice");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("attachment"), async (req, res) => {
  try {
    const {
      target,
      title,
      employeeId,
      employeeName,
      position,
      noticeType,
      publishDate,
      noticeBody,
      status,
    } = req.body;

    const requestedStatus = status === "Draft" ? "Draft" : "";
    const requiredFields = [
      target,
      title,
      employeeId,
      employeeName,
      noticeType,
      publishDate,
      noticeBody,
    ];
    const missingRequired = requiredFields.some((value) => !value);

    if (requestedStatus !== "Draft" && missingRequired) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const attachmentName = req.file ? req.file.originalname : "";
    const attachmentPath = req.file ? `/uploads/${req.file.filename}` : "";

    const publishDateValue = publishDate ? new Date(publishDate) : null;
    const resolvedStatus = requestedStatus === "Draft" ? "Draft" : "Unpublished";

    const notice = await Notice.create({
      target,
      title,
      employeeId,
      employeeName,
      position,
      noticeType,
      publishDate: publishDateValue || undefined,
      noticeBody,
      status: resolvedStatus,
      attachmentName,
      attachmentPath,
    });

    return res.status(201).json(notice);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create notice." });
  }
});

router.get("/", async (req, res) => {
  try {
    await Notice.updateMany(
      {
        status: "Unpublished",
        publishDate: { $lte: new Date() },
      },
      { status: "Published" }
    );
    const { status } = req.query;
    const query = status ? { status } : {};
    const notices = await Notice.find(query).sort({ createdAt: -1 });
    return res.json(notices);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notices." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found." });
    }
    return res.json(notice);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notice." });
  }
});

router.put("/:id", upload.single("attachment"), async (req, res) => {
  try {
    const {
      target,
      title,
      employeeId,
      employeeName,
      position,
      noticeType,
      publishDate,
      noticeBody,
    } = req.body;

    const requiredFields = [
      target,
      title,
      employeeId,
      employeeName,
      noticeType,
      publishDate,
      noticeBody,
    ];
    const missingRequired = requiredFields.some((value) => !value);

    if (missingRequired) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const publishDateValue = publishDate ? new Date(publishDate) : null;

    const update = {
      target,
      title,
      employeeId,
      employeeName,
      position,
      noticeType,
      publishDate: publishDateValue || undefined,
      noticeBody,
      status: "Unpublished",
    };

    if (req.file) {
      update.attachmentName = req.file.originalname;
      update.attachmentPath = `/uploads/${req.file.filename}`;
    }

    const notice = await Notice.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!notice) {
      return res.status(404).json({ message: "Notice not found." });
    }

    return res.json(notice);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update notice." });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Published", "Unpublished"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!notice) {
      return res.status(404).json({ message: "Notice not found." });
    }
    return res.json(notice);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update status." });
  }
});

module.exports = router;
