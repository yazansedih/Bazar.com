const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

let currentCatalogServerIndex = 0;
let currentOrderServerIndex = 0;
const CATALOG_SERVER_URLS = [
  "http://catalog-server-1:3000",
  "http://catalog-server-2:3000",
];
const ORDER_SERVER_URLS = [
  "http://order-server-1:8081",
  "http://order-server-2:8081",
];
const cache = {};
const CACHE_EXPIRATION = 60 * 1000;

// 1) GLOBAL MIDDLEWARES
function checkCache(req, res, next) {
  const key = req.originalUrl;

  if (cache[key] && Date.now() - cache[key].timestamp < CACHE_EXPIRATION) {
    console.log(`Cache hit for key: ${key}`);
    return res.json(cache[key].data);
  }

  console.log(`Cache miss for key: ${key}`);
  next();
}

function getCatalogServerURL() {
  const url = CATALOG_SERVER_URLS[currentCatalogServerIndex];
  currentCatalogServerIndex =
    (currentCatalogServerIndex + 1) % CATALOG_SERVER_URLS.length;

  return url;
}

function getOrderServerURL() {
  const url = ORDER_SERVER_URLS[currentOrderServerIndex];
  currentOrderServerIndex =
    (currentOrderServerIndex + 1) % ORDER_SERVER_URLS.length;

  return url;
}

// 3) ROUTES
app.get("/api/v1/bazar", async (req, res) => {
  res.status(200).json("Welcome to Bazar from frontend server.😁");
});

app.post("/api/v1/books", async (req, res) => {
  const title = req.body.title;
  const stock = req.body.stock;
  const cost = req.body.cost;
  const topic = req.body.topic;

  try {
    const catalogURL = getCatalogServerURL();
    const response = await axios.post(`${catalogURL}/api/v1/books`, {
      title,
      stock,
      cost,
      topic,
    });

    delete cache[`/api/v1/allBooks`];
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing create.💥" });
  }
});

app.get("/api/v1/allBooks", async (req, res) => {
  try {
    const catalogURL = getCatalogServerURL();
    results = await axios.get(`${catalogURL}/api/v1/allBooks`);

    // Cache the results
    cache[cacheKey] = { data: results.data, timestamp: Date.now() };
    res.json(results.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching search results.💥" });
  }
});

app.get("/api/v1/search", checkCache, async (req, res) => {
  const { title, topic } = req.query;
  const cacheKey = req.originalUrl;
  let results = [];

  try {
    const catalogURL = getCatalogServerURL();
    if (title) {
      results = await axios.get(
        `${catalogURL}/api/v1/search?title=${encodeURIComponent(title)}`
      );
    } else if (topic) {
      results = await axios.get(
        `${catalogURL}/api/v1/search?topic=${encodeURIComponent(topic)}`
      );
    }

    // Cache the results
    cache[cacheKey] = { data: results.data, timestamp: Date.now() };
    res.json(results.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching search results.💥" });
  }
});

app.get("/api/v1/info/:id", checkCache, async (req, res) => {
  const id = parseInt(req.params.id);
  const cacheKey = req.originalUrl;

  try {
    const catalogURL = getCatalogServerURL();
    const response = await axios.get(`${catalogURL}/api/v1/info/${id}`);

    // Cache the book info
    cache[cacheKey] = { data: response.data, timestamp: Date.now() };
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book information.💥" });
  }
});

app.put("/api/v1/update", async (req, res) => {
  const { id, stock } = req.body;

  try {
    const catalogURL = getCatalogServerURL();
    const response = await axios.put(`${catalogURL}/api/v1/update`, {
      id,
      stock,
    });

    delete cache[`/api/v1/info/${id}`];
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing update.💥" });
  }
});

app.put("/api/v1/update/cost", async (req, res) => {
  const { id, cost } = req.body;

  try {
    const catalogURL = getCatalogServerURL();
    const response = await axios.put(`${catalogURL}/api/v1/update/cost`, {
      id,
      cost,
    });

    delete cache[`/api/v1/info/${id}`];
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing update.💥" });
  }
});

app.post("/api/v1/purchase/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const orderURL = getOrderServerURL();
    const response = await axios.post(`${orderURL}/api/v1/purchase/${id}`);

    delete cache[`/api/v1/info/${id}`];
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase.💥" });
  }
});

// 3) SERVER
const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}...`);
});
