require("dotenv").config();

const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");

const serviceAccount = require("./firebase-key.json");

// Firebase Init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Firebase API Running");
});

// Save Reel URL
app.post("/save-reel", async (req, res) => {

  try {

    const { url } = req.body;

    // Check URL
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL required"
      });
    }

    // Instagram Validation
    if (!url.includes("instagram.com/reel/")) {
      return res.status(400).json({
        success: false,
        message: "Invalid Instagram Reel URL"
      });
    }

    // Save To Firebase
    await db.collection("reels").add({
      reel_url: url,
      created_at: new Date()
    });

    res.json({
      success: true,
      message: "Reel URL Saved"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});