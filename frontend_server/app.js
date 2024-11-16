const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 8002;

// Replica URLs
const catalogReplicas = [
  "http://catalog-server-1:3001",
  "http://catalog-server-2:3002",
];
let catalogCounter = 0;

// Helper function for load balancing
const getNextReplica = (replicas, counter) => {
  const replica = replicas[counter % replicas.length];
  return { replica, nextCounter: counter + 1 };
};

// In-memory cache
const cache = new Map(); // Key: bookId, Value: book details
const CACHE_LIMIT = 100;

// Cache replacement policy: LRU
const manageCacheSize = () => {
  if (cache.size > CACHE_LIMIT) {
    const oldestKey = cache.keys().next().value; // Get the oldest key
    cache.delete(oldestKey);
  }
};

// Routes
app.use(express.json());

// Query catalog with caching
app.get("/api/v1/search/:id", async (req, res) => {
  const { id } = req.params;

  // Check cache
  if (cache.has(id)) {
    console.log(`Cache hit for book ID ${id}`);
    return res.json(cache.get(id));
  }

  console.log(`Cache miss for book ID ${id}`);
  const { replica: catalogReplica, nextCounter } = getNextReplica(
    catalogReplicas,
    catalogCounter
  );
  catalogCounter = nextCounter;

  try {
    // Fetch from catalog server
    const response = await axios.get(`${catalogReplica}/api/v1/info/${id}`);
    const book = response.data;

    // Update cache
    cache.set(id, book);
    manageCacheSize();

    res.json(book);
  } catch (error) {
    console.error("Error querying catalog server:", error.message);
    res.status(500).json({ message: "Failed to query catalog server." });
  }
});

// Purchase book and invalidate cache
app.post("/api/v1/purchase/:id", async (req, res) => {
  const { id } = req.params;
  const { replica: catalogReplica, nextCounter } = getNextReplica(
    catalogReplicas,
    catalogCounter
  );
  catalogCounter = nextCounter;

  try {
    // Make purchase request to catalog server
    const response = await axios.post(
      `${catalogReplica}/api/v1/purchase/${id}`
    );

    // Invalidate cache
    if (cache.has(id)) {
      cache.delete(id);
      console.log(`Cache invalidated for book ID ${id}`);
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error processing purchase:", error.message);
    res.status(500).json({ message: "Failed to process purchase." });
  }
});

// Start the front-end server
app.listen(PORT, () => {
  console.log(`Front-end server with caching is running on port ${PORT}`);
});
