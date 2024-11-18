const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 8081;

app.use(express.json());

const CATALOG_SERVER_URLS = [
  "http://catalog-server-1:3000",
  "http://catalog-server-2:3000",
];
let currentCatalogServerIndex = 0;

function getCatalogServerURL() {
  const url = CATALOG_SERVER_URLS[currentCatalogServerIndex];
  currentCatalogServerIndex =
    (currentCatalogServerIndex + 1) % CATALOG_SERVER_URLS.length;
  return url;
}

app.get("/api/v1/bazar", async (req, res) => {
  res.status(200).json("Welcome to Bazar from order server.😁");
});

// Purchase a book
app.post("/api/v1/purchase/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const catalogURL = getCatalogServerURL();

  try {
    const response = await axios.get(`${catalogURL}/api/v1/info/${id}`);
    const book = response.data;

    if (!book) {
      return res.status(404).json({ message: "Book not found.😢" });
    }

    if (book.stock > 0) {
      // Decrement stock
      await axios.patch(`${catalogURL}/api/v1/reduce`, {
        id: id,
        stock: -1,
      });
      res.json({ message: "Purchase successful.😁" });
    } else {
      res.status(400).json({ message: "Book is out of stock.💥" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving book", error: error.message });
  }
});

// Start the order server
app.listen(PORT, () => {
  console.log(`Order server is running on port ${PORT}...`);
});
