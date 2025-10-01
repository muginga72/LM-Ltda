// routes/homeRoutes.js
const express = require("express");
const router = express.Router();

const features = [
  {
    title: "🍹 Beverages Service",
    image: "cocktail.png",
    price: "$5 - $20",
    link: "/services/beverages",
  },
  {
    title: "🍽️ Buffet for You",
    image: "buffet.png",
    price: "$15 per person",
    link: "/services/buffet",
  },
  {
    title: "📚 Tutoring",
    image: "tutor-chemistry.png",
    price: "$40/hr",
    link: "/services/tutoring",
  },
  {
    title: "👨‍🍳 Made-to-Order Meals",
    image: "mealorder.png",
    price: "$12.50",
    link: "/services/made-to-order",
  },
  {
    title: "💍 Wedding Events",
    image: "wedding.png",
    price: "$150.00",
    link: "/services/weddings",
  },
  {
    title: "🍔 Hamburgers",
    image: "humburger.png",
    price: "$10.00",
    link: "/services/hamburgers",
  },
];

router.get("/", (req, res) => {
  res.json({ features });
});

module.exports = router;
