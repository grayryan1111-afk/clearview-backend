import db from "../db.js";
import vision from "@google-cloud/vision";

export const createQuote = async (req, res) => {
  try {
    const {
      clientName,
      propertyAddress,
      floors,
      windowCount,
      pricePerWindow,
      gutterLength,
      pricePerFootGutter,
      totalPrice,
    } = req.body;

    let detectedWindows = null;

    if (req.file && process.env.VISION_ENABLED === "true") {
      const client = new vision.ImageAnnotatorClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });

      const [result] = await client.objectLocalization(req.file.path);
      let windowObjects = result.localizedObjectAnnotations.filter(
        (o) => o.name.toLowerCase() === "window"
      );

      detectedWindows = windowObjects.length;
    }

    const sql = `
      INSERT INTO quotes (clientName, propertyAddress, floors, windowCount,
      pricePerWindow, gutterLength, pricePerFootGutter, totalPrice, detectedWindows)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      clientName,
      propertyAddress,
      floors,
      windowCount,
      pricePerWindow,
      gutterLength,
      pricePerFootGutter,
      totalPrice,
      detectedWindows,
    ];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ message: "Failed to save quote" });

      return res.json({ id: this.lastID, message: "Quote created" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Quote creation failed" });
  }
};

export const getQuotes = (req, res) => {
  db.all(`SELECT * FROM quotes ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Could not retrieve quotes" });
    return res.json(rows);
  });
};

export const getQuoteById = (req, res) => {
  db.get(`SELECT * FROM quotes WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: "Could not fetch quote" });
    if (!row) return res.status(404).json({ message: "Quote not found" });
    return res.json(row);
  });
};
