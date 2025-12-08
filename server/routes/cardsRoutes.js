// routes/cardsRoutes.js
const express = require("express");
const router = express.Router();

/**
 * Backwards compatibility note:
 * - If a consumer still expects a single left object, they can use left.items[0]
 *   or the legacy left.image/title fields (kept here for convenience).
 */
const cardSets = [
  {
    id: 1,
    left: {
      items: [
        {
          image: "rent-room-for-day.png",
          title: "🛏️ Rent a Room for a Day",
          description: "Short‑term stays, hourly or daily bookings.",
          price: "",
        },
        {
          image: "list-your-room.png",
          title: "🏷️ List Your Room",
          description: "Earn from spare space by hosting on your terms",
          price: "",
        },
      ],

      // Keep legacy top-level fields for consumers that still reference them
      image: "cocktail-left1.png",
      title: "🍹 Beverages Service",
      description: "",
      price: "",

      // Promotional videos remain in the same place
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
      {
        image: "salao-de-festas1a.jpg",
        title: "💍 Wedding Events",
        description: "Elegant planning and coordination for unforgettable weddings.",
        price: "",
      },
      {
        image: "buffet-left1b.jpg",
        title: "🍽️ Buffet for You",
        description: "Delicious self-serve meals for events and gatherings.",
        price: "",
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
  // Example of another cardSet kept commented for future expansion
  // {
  //   id: 2,
  //   left: {
  //     items: [
  //       { image: "wedding-left2a.jpeg", title: "💍 Wedding Events", description: "Full wedding coordination", price: "" },
  //       { image: "wedding-left2b.jpeg", title: "🎉 Reception Planning", description: "Venue & vendor coordination", price: "" }
  //     ],
  //     image: "wedding-left2.jpeg",
  //     title: "💍 Wedding Events",
  //     price: "",
  //     videos: [
  //       {
  //         type: "video",
  //         src: "/videos/set-2/140111-774507949_tiny.mp4",
  //         caption: "Pixabay Sea-ocean-seagulls-birds-sunset",
  //       },
  //     ],
  //   },
  //   right: [
  //     { image: "tutoring-right2a.jpeg", title: "📚 Tutoring", price: "" },
  //     { image: "humburger-right2b.png", title: "🍔 Hamburgers", price: "" },
  //   ],
  // },
];

router.get("/", (req, res) => {
  res.json({ cardSets });
});

module.exports = router;