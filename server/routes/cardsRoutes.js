// routes/homeRoutes.js
const express = require("express");
const router = express.Router();

const cardSets = [
  {
    id: 1,
    left: {
      image: "cocktail-left1.png",
      title: "🍹 Beverages Service",
      price: "",
    },
    right: [
      { image: "buffet-left1a.png", title: "🍽️ Buffet for You", price: "" },
      { image: "mealorder-left1b.png", title: "👨‍🍳 Made-to-Order Meals", price: "" },
    ],
  },
  {
    id: 2,
    left: {
      image: "wedding-left2.png",
      title: "💍 Wedding Events",
      price: "",
    },
    right: [
      { image: "tutor-chemistry-right2a.png", title: "📚 Tutoring", price: "" },
      { image: "humburger-right2b.png", title: "🍔 Hamburgers", price: "" },
    ],
  },
];

router.get("/", (req, res) => {
  res.json({ cardSets });
});

module.exports = router;
