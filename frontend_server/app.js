const express = require("express");
const axios = require("axios"); // For making HTTP requests to other services
const app = express();
const PORT = 8082;

app.use(express.json());

const CATALOG_SERVER_URL = "http://localhost:3000";
const ORDER_SERVER_URL = "http://localhost:8081";

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

// Update stock
app.put("/api/v1/update", async (req, res) => {
  const { id, stock } = req.body;

  try {
    const response = await axios.put(`${CATALOG_SERVER_URL}/api/v1/update`, {
      id,
      stock,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing update.💥" });
  }
});

// Update cost
app.put("/api/v1/update/cost", async (req, res) => {
  const { id, cost } = req.body;
  6;
  try {
    const response = await axios.put(
      `${CATALOG_SERVER_URL}/api/v1/update/cost`,
      {
        id,
        cost,
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing update.💥" });
  }
});

// Purchase a book by item id
app.post("/api/v1/purchase/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const response = await axios.post(
      `${ORDER_SERVER_URL}/api/v1/purchase/${id}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase.💥" });
  }
});

// Start the front-end server
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
