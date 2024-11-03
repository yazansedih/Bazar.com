const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
const PORT = 8082;
app.use(express.json());

// Initialize the in-memory cache with a TTL of 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

// Replicated servers for load balancing
const CATALOG_REPLICAS = [
  "http://catalog-server:3000",
  "http://catalog-server:3001",
];
const ORDER_REPLICAS = ["http://order-server:8081", "http://order-server:8082"];

let catalogIndex = 0;
let orderIndex = 0;

// Round-robin load balancing function
function getCatalogServer() {
  const server = CATALOG_REPLICAS[catalogIndex];
  catalogIndex = (catalogIndex + 1) % CATALOG_REPLICAS.length;
  return server;
}

function getOrderServer() {
  const server = ORDER_REPLICAS[orderIndex];
  orderIndex = (orderIndex + 1) % ORDER_REPLICAS.length;
  return server;
}

app.get("/api/v1/bazar", async (req, res) => {
  res.status(200).json("Welcome to Bazar from frontend server.😁");
});

app.get("/api/v1/search", async (req, res) => {
  const { title, topic } = req.query;
  const cacheKey = title ? `title-${title}` : `topic-${topic}`;

  const cachedResults = cache.get(cacheKey);
  if (cachedResults) {
    console.log(`[Cache HIT] Key: ${cacheKey}`);
    return res.json(cachedResults);
  }

  try {
    const server = getCatalogServer();
    const url = title
      ? `${server}/api/v1/search?title=${encodeURIComponent(title)}`
      : `${server}/api/v1/search?topic=${encodeURIComponent(topic)}`;

    const response = await axios.get(url);
    cache.set(cacheKey, response.data); // Cache the result
    console.log(`[Cache MISS] Key: ${cacheKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching search results.💥" });
  }
});

// Get book information by ID with caching and load balancing
app.get("/api/v1/info/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const cacheKey = `book-${id}`;

  // Check cache first
  const cachedBook = cache.get(cacheKey);
  if (cachedBook) {
    console.log(`[Cache HIT] Key: ${cacheKey}`);
    return res.json(cachedBook);
  }

  try {
    const server = getCatalogServer();
    const response = await axios.get(`${server}/api/v1/info/${id}`);
    cache.set(cacheKey, response.data); // Cache the book information
    console.log(`[Cache MISS] Key: ${cacheKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book information.💥" });
  }
});

// Update stock
app.put("/api/v1/update", async (req, res) => {
  const { id, stock } = req.body;

  try {
    const server = getCatalogServer();
    const response = await axios.put(`${server}/api/v1/update`, {
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
    const server = getCatalogServer();
    const response = await axios.put(`${server}/api/v1/update/cost`, {
      id,
      cost,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing update.💥" });
  }
});

// Purchase a book by item id
app.post("/api/v1/purchase/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const server = getOrderServer();
    const response = await axios.post(`${server}/api/v1/purchase/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase.💥" });
  }
});

// Start the frontend server
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
