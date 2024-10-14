const express = require("express");
const axios = require("axios"); // For making HTTP requests to other services
const app = express();
const PORT = 3000;

app.use(express.json());

const CATALOG_SERVER_URL = "http://localhost:8081";
const ORDER_SERVER_URL = "http://localhost:8082";

app.get("/api/v1/bazar", async (req, res) => {
  res.status(200).json("Welcome to Bazar from fronend server.😁");
});

// Search books by topic
app.get("/api/v1/search", async (req, res) => {
  const { title, topic } = req.query;
  let results = [];

  try {
    if (title) {
      results = await axios.get(
        `${CATALOG_SERVER_URL}/api/v1/search?title=${encodeURIComponent(title)}`
      );
    } else if (topic) {
      results = await axios.get(
        `${CATALOG_SERVER_URL}/api/v1/search?topic=${encodeURIComponent(topic)}`
      );
    }

    res.json(results.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching search results.💥" });
  }
});

// Get book information by item id
app.get("/api/v1/info/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const response = await axios.get(`${CATALOG_SERVER_URL}/api/v1/info/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book information.💥" });
  }
});

// Purchase a book by item id
app.get("/api/v1/purchase/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const response = await axios.get(
      `${ORDER_SERVER_URL}/api/v1/purchase/${id}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase.💥" });
  }
});

// Start the front-end server
app.listen(PORT, () => {
  console.log(`Front-end server is running on port ${PORT}`);
});
