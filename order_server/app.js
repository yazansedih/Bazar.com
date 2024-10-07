const express = require("express");
const axios = require("axios"); // For querying the catalog server
const app = express();
const PORT = process.env.PORT || 8082;

app.use(express.json());

// Catalog server URL
const CATALOG_SERVER_URL = "http://localhost:8081";

app.get("/bazar", async (req, res) => {
  res.send("Welcome to Bazar from order server :)");
});

// Purchase a book
app.post("/purchase/:id", async (req, res) => {
  const itemNumber = parseInt(req.params.item_number);
  try {
    const response = await axios.get(
      `${CATALOG_SERVER_URL}/info/${itemNumber}`
    );
    const book = response.data;

    if (book.stock > 0) {
      // Decrement stock
      await axios.post(`${CATALOG_SERVER_URL}/update`, {
        item_number: itemNumber,
        stock: -1,
      });
      res.json({ message: "Purchase successful", book });
    } else {
      res.status(400).json({ message: "Book is out of stock" });
    }
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Start the order server
app.listen(PORT, () => {
  console.log(`Order server is running on port ${PORT}`);
});
