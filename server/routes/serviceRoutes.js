// server/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();

const services = [
  {
    id: 1,
    title: "🍹 Retail Beverages",
    description: "Offering a wide variety of drinks and refreshments.",
    image: "/beverage.png",
  },
  {
    id: 2,
    title: "🍽️ Buffet services",
    description: "Delicious self-serve meals for events and gatherings.",
    image: "/buffet.png",
  },
  {
    id: 3,
    title: "📚 Tutoring",
    description: "Personalized academic support for students.",
    image: "/tutoring.png",
  },
  {
    id: 4,
    title: "💇 Beauty salon",
    description: "Hair, skin, and nail treatments to help you shine.",
    image: "/beauty-salon.png",
  },
  {
    id: 5,
    title: "💍 Wedding Events",
    description:
      "Elegant planning and coordination for unforgettable weddings.",
    image: "/wedding.png",
  },
  {
    id: 6,
    title: "🧑‍💻 Web Development",
    description: "Custom websites and web apps tailored to your business.",
    image: "/web-dev.png",
  },
];
router.get("/", (req, res) => {
  res.json({ services });
});

module.exports = router;
