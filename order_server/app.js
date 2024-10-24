const express = require("express");
const axios = require("axios"); // For querying the catalog server
const app = express();
const PORT = 8081;

app.use(express.json());

// Catalog server URL
const CATALOG_SERVER_URL = "http://localhost:8081";

app.get("/api/v1/bazar", async (req, res) => {
  res.status(200).json("Welcome to Bazar from order server.😁");
});

// Purchase a book
app.post("/api/v1/purchase/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("Requested Book ID:", id);

  try {
    const response = await axios.get(`${CATALOG_SERVER_URL}/api/v1/info/${id}`);
    const book = response.data;

    if (!book) {
      return res.status(404).json({ message: "Book not found.😢" });
    }

    if (book.stock > 0) {
      // Decrement stock
      await axios.patch(`${CATALOG_SERVER_URL}/api/v1/reduce`, {
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
  console.log(`Order server is running on port ${PORT}`);
});
