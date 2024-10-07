import express from "express";
import books from "./database.js";

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());

app.get("/bazar", async (req, res) => {
  res.send("Welcome to Bazar from catalog server :)");
});

// Query by subject
app.get("/search/:topic", (req, res) => {
  const topic = req.params.topic;
  const results = books.filter(
    (book) => book.topic.toLowerCase() === topic.toLowerCase()
  );
  res.json(results);
});

// Query by item
app.get("/info/:id", (req, res) => {
  const itemNumber = parseInt(req.params.id);
  const book = books.find((book) => book.id === itemNumber);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Update stock
app.post("/update", (req, res) => {
  const { item_number, stock } = req.body;
  const book = books.find((book) => book.id === item_number);
  if (book) {
    book.stock += stock;
    res.json({ message: "Stock updated", book });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Start the catalog server
app.listen(PORT, () => {
  console.log(`Catalog server is running on port ${PORT}`);
});
