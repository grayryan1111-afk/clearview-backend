import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing auth token" });

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
