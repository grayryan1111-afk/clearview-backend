import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.get(sql, [email], async (err, user) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email }
    });
  });
};
