const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM likes");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query("SELECT * FROM likes WHERE userId = ?", [userId]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName, articleId, articleTitle } = req.body;
    
    if (!userName || !articleId || !articleTitle) {
      return res.status(400).json({ message: "Données invalides ou manquantes" });
    }

    const [existing] = await db.query("SELECT * FROM likes WHERE userId = ? AND articleId = ?", [userId, articleId]);
    
    if (existing.length === 0) {
      await db.query(
        "INSERT INTO likes (userId, userName, articleId, articleTitle) VALUES (?, ?, ?, ?)",
        [userId, userName, articleId, articleTitle]
      );
    }
    res.status(201).json({ message: "Activité ajoutée aux favoris" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:articleId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = req.params.articleId;
    
    if (!articleId) {
      return res.status(400).json({ message: "ID de l'article manquant" });
    }

    await db.query("DELETE FROM likes WHERE userId = ? AND articleId = ?", [userId, articleId]);
    res.status(200).json({ message: "Activité retirée des favoris" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;