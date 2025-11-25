import bcrypt from "bcryptjs";
import db from "../db.js";

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [email, hashed],
    function (err) {
      if (err) return res.status(500).json({ message: "Could not create user" });
      return res.json({ id: this.lastID, message: "User created" });
    }
  );
};
