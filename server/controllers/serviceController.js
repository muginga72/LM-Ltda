const Service = require("../models/Service");

// List services (public)
exports.listServices = async (req, res) => {
  try {
    const services = await Service.find({ enabled: true })
      .sort({ createdAt: -1 })
      .lean();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

exports.createService = async (req, res) => {
  try {
    const { title, description, price, imagePath } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const service = new Service({
      title,
      description,
      price: price || 0,
      imagePath: imagePath || "", // 👈 match schema
    });

    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error("Error creating service:", err); // 👈 add this
    res.status(500).json({ error: "Failed to create service" });
  }
};

// Optional: get single service
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).lean();
    if (!service) return res.status(404).json({ error: "Not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service" });
  }
};

// Optional: delete service (admin)
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
};