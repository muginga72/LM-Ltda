// routes/cardsRoutes.js
const express = require("express");
const router = express.Router();

const cardSets = [
  {
    id: 1,
    left: {
      image: "cocktail-left1.png",
      title: "🍹 Beverages Service",
      price: "",
      videos: [
        {
          type: "video",
          src: "/videos/set-1/video-promo.mp4",
          caption: "Beverages service overview",
        },
        {
          type: "video",
          src: "/videos/set-2/140111-774507949_tiny.mp4",
          caption: "Pixabay Sea-ocean-seagulls-birds-sunset",
        },
      ],
    },
    right: [
      { image: "salao-de-festas1a.jpg", 
        title: "💍 Wedding Events", 
        price: "" 
      },
      { image: "buffet-left1b.jpg", 
        title: "🍽️ Buffet for You", 
        price: "" 
      },

    // Do not remove: It is reserved for future use
      // {
      //   image: "mealorder-left1b.jpg",
      //   title: "👨‍🍳 Made-to-Order Meals",
      //   price: "",
      // },
    ],
  },

  // --------- Do not remove: It is reserved for future use ---------

  // {
    // id: 2,
    // left: {
    //   image: "wedding-left2.jpeg",
    //   title: "💍 Wedding Events",
    //   price: "",
    //   videos: [
    //     {
    //       type: "video",
    //       src: "/videos/set-2/140111-774507949_tiny.mp4",
    //       caption: "Pixabay Sea-ocean-seagulls-birds-sunset",
    //     },
    //     {
    //       type: "",
    //       src: "",
    //       caption: "",
    //     },
    //   ],
    // },
    // right: [
    //   { image: "tutoring-right2a.jpeg", title: "📚 Tutoring", price: "" },
    //   { image: "humburger-right2b.png", title: "🍔 Hamburgers", price: "" },
    // ],
  // },
];

router.get("/", (req, res) => {
  res.json({ cardSets });
});

module.exports = router;
