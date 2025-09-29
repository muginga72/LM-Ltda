// server/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();

const services = [
  {
    id: 1,
    title: "📊 Consulting",
    description: "Offering a wide variety of drinks and refreshments.",
    image: "/consulting-sp.png",
  },
  {
    id: 2,
    title: "🍹 Retail Beverages",
    description: "Offering a wide variety of drinks and refreshments.",
    image: "/beverage-sp.png",
  },
  {
    id: 3,
    title: "🍽️ Buffet services",
    description: "Delicious self-serve meals for events and gatherings.",
    image: "/buffet-sp.png",
  },
  {
    id: 4,
    title: "📚 Tutoring",
    description: "Personalized academic support for students.",
    image: "/tutoring-sp.png",
  },
  {
    id: 5,
    title: "💇 Beauty salon",
    description: "Hair, skin, and nail treatments to help you shine.",
    image: "/beauty-salon-sp.png",
  },
  {
    id: 6,
    title: "👨‍🍳 Made-to-Order Meals",
    description: "Whether it is a build-your-own bowl concept or a chef-prepared dinner tailored to dietary restrictions.",
    image: "/meal-to-order-sp.png",
  },
  {
    id: 7,
    title: "🍔 Hamburguer",
    description: "The humble hamburger is a culinary icon versatile, nostalgic, and endlessly customizable.",
    image: "/humburger-sp.png",
  },
  {
    id: 8,
    title: "💍 Wedding Events",
    description:
      "Elegant planning and coordination for unforgettable weddings.",
    image: "/wedding-sp.png",
  },
  {
    id: 9,
    title: "🧑‍💻 Web Development",
    description: "Custom websites and web apps tailored to your business.",
    image: "/developer-sp.png",
  },
  {
    id: 10,
    title: "🎉 Party Salon",
    description: "A party salon is a vibrant space designed for celebration birthdays, baby showers, graduations, and more.",
    image: "party-salon-sp.png",
  },
];
router.get("/", (req, res) => {
  res.json({ services });
});

module.exports = router;
