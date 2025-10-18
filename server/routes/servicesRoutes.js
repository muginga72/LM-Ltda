// server/routes/servicesRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");              
const controller = require("../controllers/serviceController");

const router = express.Router();

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // save uploads in /server/uploads
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Async wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET all services
router.get("/", asyncHandler(controller.listServices));

// GET single service by ID
router.get("/:id", asyncHandler(controller.getService));

// POST create new service with image upload
router.post("/", upload.single("image"), asyncHandler(controller.createService));
router.put("/:id", upload.single("image"), asyncHandler(controller.updateService));
router.delete("/:id", asyncHandler(controller.deleteService));

module.exports = router;