const Service = require("../models/Service");

// GET all
exports.listServices = async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(services);
};

// GET one
exports.getService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json(service);
};

// CREATE
exports.createService = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const imagePath = `/uploads/${req.file.filename}`; // store relative path

    const service = new Service({
      title: title.trim(),
      description,
      price: price || 0,
      imagePath,
      createdBy: req.user?._id,
    });

    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error("Create service error:", err);
    res.status(500).json({ error: "Failed to create service" });
  }
};

// UPDATE
exports.updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json(service);
};

// DELETE
exports.deleteService = async (req, res) => {
  const deleted = await Service.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Service not found" });
  res.json({ message: "Service deleted" });
};