// server/routes/testimonials.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    overview: {
      title: "Service Overview",
      content: "LM-Ltd Services is a modular platform designed to streamline data delivery, image rendering, and service management for scalable web applications. Its mission is to empower developers and product teams with reliable backend infrastructure and intuitive frontend integration. Key offerings include promo product data integration, static image serving via Express, and customizable service management tools that prioritize clarity, maintainability, and user experience."
    },
    howItWorks: {
      title: "How It Works",
      content: "The LMJM flow begins with Express backend routes that expose RESTful endpoints for promo product data and image assets. These endpoints are consumed by React components using custom hooks and conditional rendering. Validation logic ensures data integrity before rendering, while static assets are served via Express middleware. This modular pipeline guarantees seamless backend-to-frontend communication, optimized for speed and reliability."
    },
    benefitsValues: {
      title: "Benefits & Value",
      content: [
        "Faster access to promo product data and images",
        "Reliable static image rendering via Express",
        "Scalable architecture built with modular components",
        "Maintainable codebase with defensive patterns and clear separation of concerns"
      ]
    },
    useCases: {
      title: "Use Cases",
      content: "LM-Ltd Services is ideal for promotional platforms needing dynamic product displays, educational tools requiring structured data access, and service management dashboards that demand reliability and clarity. For example, a marketing team can integrate promo product data into a React frontend with image previews, while educators can use the platform to serve curated content with validated endpoints."
    },
    techStack: {
      title: "Tech Stack Transparency",
      content: "LM-Ltd Services is built using React for the frontend and Express for the backend, with RESTful APIs facilitating communication. The architecture emphasizes modularity, using custom hooks and reusable components. Defensive coding practices—such as input validation, error handling, and endpoint testing—ensure robustness and maintainability across deployments."
    },
    developerFeatures: {
      title: "Developer-Friendly Features",
      content: "Developers can preview API documentation with clear endpoint descriptions and validation logic. A sample endpoint might include `/api/promoProducts/:id` with schema validation for ID format and response structure. If available, GitHub or sandbox links provide hands-on access to the codebase and allow testing in isolated environments."
    },
    scalability: {
      title: "Scalability & Reliability",
      content: "LM-Ltd Services is designed for high uptime and performance, with benchmarks showing sub-200ms response times for key endpoints. Edge cases—such as missing image assets or malformed data—are handled gracefully with fallback logic and error messaging. The modular design supports future growth, allowing new services to be added without disrupting existing flows."
    },
    callToAction: {
      title: "📞 Call to Action",
      content: "Ready to explore LMJM-services? Schedule a Demo to see it in action, Explore Docs for technical deep dives, or Contact Us to discuss integration. Optionally, try a live preview or mock API call to experience the flow firsthand."
    },
    wedding: [
      { name: "Joaquim & Maria", quote: "The party salon made our wedding unforgettable..." },
      { name: "Dorcas M.", quote: "From planning to execution, everything was seamless..." },
      { name: "Domingos & Ana", quote: "We loved the flexibility in layout..." }
    ],
    tutoringChemistry: [
      { name: "Mutula A.", quote: "Chemistry used to feel impossible..." },
      // { name: "Dr. Nguyen", quote: "The modular lesson plans helped my students..." },
      // { name: "Emily S.", quote: "Tutoring chemistry online felt surprisingly engaging..." }
    ]
  });
});

module.exports = router;