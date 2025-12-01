// routes/roomrental/roomRoutes.js

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Use exact path and case for your project
const roomsController = require("../../controllers/roomrental/roomsController");
const { protect, adminOnly } = require("../../middleware/authMiddleware");

// Basic runtime validation to fail fast during startup
if (!roomsController || typeof roomsController !== "object") {
  throw new Error("Invalid import: controllers/roomrental/roomsController must export an object");
}
if (typeof protect !== "function" || typeof adminOnly !== "function") {
  throw new Error("Invalid import: middleware/authMiddleware must export { protect, adminOnly } functions");
}
["getRooms", "createRoom", "updateRoom", "deleteRoom"].forEach((fn) => {
  if (typeof roomsController[fn] !== "function") {
    throw new Error(`Invalid export: roomsController.${fn} must be a function`);
  }
});

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "..", "..", "uploads", "rooms");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer disk storage so files persist
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

// Accept images only and limit size
const fileFilter = (req, file, cb) => {
  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter,
});

// Match frontend field name exactly: images
const imagesUpload = upload.array("images", 12);

// Utility: safely parse JSON-like strings sent inside FormData
function safeParse(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

// Helper: build images metadata from multer files
function buildImagesArray(files, req) {
  if (!Array.isArray(files)) return [];
  return files.map((f) => ({
    filename: f.filename,
    originalname: f.originalname,
    mimetype: f.mimetype,
    size: f.size,
    url: `${req.protocol}://${req.get("host")}/uploads/rooms/${f.filename}`,
    path: f.path,
  }));
}

router.get("/", protect, roomsController.getRooms);

// CREATE room with images
router.post("/", protect, adminOnly, imagesUpload, async (req, res, next) => {
  try {
    const title = req.body.roomTitle || req.body.title || "";
    req.body.roomTitle = title;

    if (!title || String(title).trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    // Parse JSON-like fields if sent inside FormData
    req.body.pricePerNight = safeParse(req.body.pricePerNight, req.body.pricePerNight);
    req.body.roomLocation = safeParse(req.body.roomLocation, req.body.roomLocation);
    req.body.amenities = safeParse(req.body.amenities, req.body.amenities || []);
    req.body.rules = safeParse(req.body.rules, req.body.rules || []);
    req.body.images = buildImagesArray(req.files, req);

    return roomsController.createRoom(req, res, next);
  } catch (err) {
    next(err);
  }
});

// UPDATE room with optional images (appendImages=true to append)
router.put("/:id", protect, adminOnly, imagesUpload, async (req, res, next) => {
  try {
    if (req.body.title && !req.body.roomTitle) req.body.roomTitle = req.body.title;
    req.body.pricePerNight = safeParse(req.body.pricePerNight, req.body.pricePerNight);
    req.body.roomLocation = safeParse(req.body.roomLocation, req.body.roomLocation);
    req.body.amenities = safeParse(req.body.amenities, req.body.amenities);
    req.body.rules = safeParse(req.body.rules, req.body.rules);
    req.body.uploadedImages = buildImagesArray(req.files, req);
    req.query.appendImages = String(req.query.appendImages || "true").toLowerCase();

    return roomsController.updateRoom(req, res, next);
  } catch (err) {
    next(err);
  }
});

// DELETE room
router.delete("/:id", protect, adminOnly, roomsController.deleteRoom);

module.exports = router;