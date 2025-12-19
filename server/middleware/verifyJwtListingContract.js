// server/middleware/verifyJwtListingContract.js
const jwt = require("jsonwebtoken");

const verifyJwtListingContract = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload should include user id and email; adapt to your token shape
    req.user = { id: payload.sub || payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyJwtListingContract;