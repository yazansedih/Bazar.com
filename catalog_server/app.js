import express from "express";
import books from "./database.js";

const app = express();
const PORT = 8081;

app.use(express.json());

app.get("/api/v1/bazar", async (req, res) => {
  res.status(200).json("Welcome to Bazar from catalog server.😁");
});

// Query by title or topic using query
app.get("/api/v1/search", (req, res) => {
  const { title, topic } = req.query;
  let results = [];

  if (title) {
    results = books.filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );
  } else if (topic) {
    results = books.filter(
      (book) => book.topic.toLowerCase() === topic.toLowerCase()
    );
  }

  res.json(results);
});

// Query by id
app.get("/api/v1/info/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((book) => book.id === id);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found.💥" });
  }
});

// Update stock
app.put("/api/v1/update", (req, res) => {
  const { id, stock } = req.body;
  const book = books.find((book) => book.id === id);

  if (book) {
    book.stock = stock;
    res.json({ message: "Stock updated.👍", book });
  } else {
    res.status(404).json({ message: "Book not found.💥" });
  }
});

// Reduce stock
app.patch("/api/v1/reduce", (req, res) => {
  const { id } = req.body;
  const book = books.find((book) => book.id === id);

  if (book) {
    book.stock = book.stock - 1;
    res.json({ message: "Stock reduced.👍", book });
  } else {
    res.status(404).json({ message: "Book not found.💥" });
  }
});

// Start the catalog server
app.listen(PORT, () => {
  console.log(`Catalog server is running on port ${PORT}`);
});
