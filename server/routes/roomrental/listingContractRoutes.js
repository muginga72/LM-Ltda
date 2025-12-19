// server/routes/roomrental/listingContractRoutes.js
const express = require("express");
const router = express.Router();
const Acknowledgement = require("../../models/roomrental/ListingContract");
const verifyJwt = require("../../middleware/verifyJwtListingContract");

router.post("/acknowledge-contract", verifyJwt, async (req, res) => {
  try {
    const { acknowledgedAt, acknowledgedByName, meta } = req.body;
    if (!acknowledgedAt || !acknowledgedByName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ack = new Acknowledgement({
      userId: req.user.id,
      acknowledgedByName,
      acknowledgedAt: new Date(acknowledgedAt),
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      meta: meta || {},
    });

    await ack.save();
    return res.status(201).json({ success: true, id: ack._id });
  } catch (err) {
    console.error("Error saving acknowledgement:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;