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
      { image: "buffet-left1a.jpg", title: "🍽️ Buffet for You", price: "" },
      { image: "mealorder-left1b.jpg", title: "👨‍🍳 Made-to-Order Meals", price: "" },
    ],
  },
  {
    id: 2,
    left: {
      image: "wedding-left2.jpeg",
      title: "💍 Wedding Events",
      price: "",
    },
    right: [
      { image: "tutoring-right2a.jpeg", title: "📚 Tutoring", price: "" },
      { image: "humburger-right2b.png", title: "🍔 Hamburgers", price: "" },
    ],
  },
];

router.get("/", (req, res) => {
  res.json({ cardSets });
});

module.exports = router;
