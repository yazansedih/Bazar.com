const express = require("express");
const axios = require("axios"); // For making HTTP requests to other services
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Catalog and Order server URLs (you may need to adjust these based on your deployment)
const CATALOG_SERVER_URL = "http://localhost:8081"; // Assuming catalog server runs on port 8081
const ORDER_SERVER_URL = "http://localhost:8082"; // Assuming order server runs on port 8082

app.get("/bazar", async (req, res) => {
  res.send("Welcome to Bazar from fronend server   :)");
});

// Search books by topic
app.get("/search", async (req, res) => {
  const topic = req.query.topic;
  try {
    const response = await axios.get(`${CATALOG_SERVER_URL}/search/${topic}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching search results" });
  }
});

// Get book information by item number
app.get("/info/:id", async (req, res) => {
  const itemNumber = req.params.item_number;
  try {
    const response = await axios.get(
      `${CATALOG_SERVER_URL}/info/${itemNumber}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book information" });
  }
});

// Purchase a book by item number
app.post("/purchase/:id", async (req, res) => {
  const itemNumber = req.params.item_number;
  try {
    const response = await axios.post(
      `${ORDER_SERVER_URL}/purchase/${itemNumber}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase" });
  }
});

// Start the front-end server
app.listen(PORT, () => {
  console.log(`Front-end server is running on port ${PORT}`);
});
