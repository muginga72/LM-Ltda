// server/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();

const services = [
  {
    id: 1,
    title: "📊 Consulting",
    description: "Offering a wide variety of drinks and refreshments.",
    image: "/consulting-sp.png",
    price: "Negotiable",
  },
  {
    id: 2,
    title: "🍹 Retail Beverages",
    description: "Offering a wide variety of drinks and refreshments.",
    image: "/beverage-sp.png",
    price: "5.00",
  },
  {
    id: 3,
    title: "🍽️ Buffet services",
    description: "Delicious self-serve meals for events and gatherings.",
    image: "/buffet-sp.png",
    price: "15.00",
  },
  {
    id: 4,
    title: "📚 Tutoring",
    description: "Personalized academic support for students.",
    image: "/tutoring-sp.png",
    price: "40.00",
  },
  {
    id: 5,
    title: "💇 Beauty salon",
    description: "Hair, skin, and nail treatments to help you shine.",
    image: "/beauty-salon-sp.png",
    price: "50.00",
  },
  {
    id: 6,
    title: "👨‍🍳 Made-to-Order Meals",
    description: "Whether it is a build-your-own bowl concept or a chef-prepared dinner tailored to dietary restrictions.",
    image: "/meal-to-order-sp.png",
    price: "12.50",
  },
  {
    id: 7,
    title: "🍔 Hamburguer",
    description: "The humble hamburger is a culinary icon versatile, nostalgic, and endlessly customizable.",
    image: "/humburger-sp.png",
    price: "10.00",
  },
  {
    id: 8,
    title: "💍 Wedding Events",
    description:
      "Elegant planning and coordination for unforgettable weddings.",
    image: "/wedding-sp.png",
    price: "150.00"
  },
  {
    id: 9,
    title: "🧑‍💻 Web Development",
    description: "Custom websites and web apps tailored to your business.",
    image: "/developer-sp.png",
    price: "Negotiable",
  },
  {
    id: 10,
    title: "🎉 Party Salon",
    description: "A party salon is a vibrant space designed for celebration birthdays, baby showers, graduations, and more.",
    image: "party-salon-sp.png",
    price: "150.00"
  },
];
router.get("/", (req, res) => {
  res.json({ services });
});

module.exports = router;
