import express from "express";
import axios from "axios"; // Add axios to send HTTP requests to replicas
import books from "./database.js";

const app = express();
const PORT = 3000;

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
app.put("/api/v1/update", async (req, res) => {
  const { id, stock } = req.body;
  const book = books.find((book) => book.id === id);

  if (book) {
    book.stock = stock;

    // Synchronize update with other replicas
    await syncWithReplicas(id, stock);

    res.json({ message: "Stock updated and synchronized.👍", book });
  } else {
    res.status(404).json({ message: "Book not found.💥" });
  }
});

// Update cost
app.put("/api/v1/update/cost", async (req, res) => {
  const { id, cost } = req.body;
  const book = books.find((book) => book.id === id);

  if (book) {
    book.cost = cost;

    // Synchronize update with other replicas
    await syncWithReplicas(id, cost);

    res.json({ message: "Cost updated and synchronized.👍", book });
  } else {
    res.status(404).json({ message: "Book not found.💥" });
  }
});

// Reduce stock
app.patch("/api/v1/reduce", async (req, res) => {
  const { id } = req.body;
  const book = books.find((book) => book.id === id);

  if (book) {
    book.stock = book.stock - 1;

    // Synchronize the reduced stock with other replicas
    await syncWithReplicas(id, book.stock);

    res.json({ message: "Stock reduced and synchronized.👍", book });
  } else {
    res.status(404).json({ message: "Book not found.💥" });
  }
});

// Sync the update across replicas
const syncWithReplicas = async (id, stock) => {
  const otherReplicas = [
    "http://catalog-server-1:3001",
    "http://catalog-server-2:3002",
  ];

  // Send the update to other replicas
  for (let replica of otherReplicas) {
    try {
      await axios.put(`${replica}/api/v1/update`, { id, stock });
      console.log(`Synchronized update with ${replica}`);
    } catch (error) {
      console.error("Error synchronizing with replica:", error.message);
    }
  }
};

// Start the catalog server
app.listen(PORT, () => {
  console.log(`Catalog server is running on port ${PORT}`);
});
