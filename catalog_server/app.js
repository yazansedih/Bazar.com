import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import Book from "./models/bookModel.js";

dotenv.config();

const app = express();
app.use(express.json());

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

app.get("/api/v1/bazar", (req, res) => {
  res.status(200).json("Welcome to Bazar from catalog server.😁");
});

app.post("/api/v1/books", async (req, res) => {
  const newBook = await Book.create({
    title: req.body.title,
    stock: req.body.stock,
    cost: req.body.cost,
    topic: req.body.topic,
  });
  res.status(201).json({
    message: "New book added successfully.",
    book: newBook,
  });
});

app.get("/api/v1/allBooks", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books.💥" });
  }
});

// Search books by title or topic
app.get("/api/v1/search", async (req, res) => {
  const { title, topic } = req.query;

  try {
    const results = title
      ? await Book.find({ title: new RegExp(`^${title}$`, "i") })
      : topic
      ? await Book.find({ topic: new RegExp(`^${topic}$`, "i") })
      : [];
    res.json(results);
  } catch (error) {
    console.error("Error fetching books by search:", error);
    res.status(500).json({ message: "Error fetching books.💥" });
  }
});

// Get book information by ID
app.get("/api/v1/info/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book info:", error);
    res.status(500).json({ message: "Error fetching book information" });
  }
});

// Update stock
app.put("/api/v1/update", async (req, res) => {
  const { id, stock } = req.body;

  try {
    const book = await Book.findByIdAndUpdate(id, { stock }, { new: true });
    if (book) {
      res.json({ message: "Stock updated.👍", book });
    } else {
      res.status(404).json({ message: "Book not found.💥" });
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Error updating stock.💥" });
  }
});

// Update cost
app.put("/api/v1/update/cost", async (req, res) => {
  const { id, cost } = req.body;

  try {
    const book = await Book.findByIdAndUpdate(id, { cost }, { new: true });
    if (book) {
      res.json({ message: "Cost updated.👍", book });
    } else {
      res.status(404).json({ message: "Book not found.💥" });
    }
  } catch (error) {
    console.error("Error updating cost:", error);
    res.status(500).json({ message: "Error updating cost.💥" });
  }
});

// Reduce stock
app.patch("/api/v1/reduce", async (req, res) => {
  const { id } = req.body;

  try {
    const book = await Book.findById(id);
    if (book) {
      book.stock -= 1;
      await book.save();
      res.json({ message: "Stock reduced.👍", book });
    } else {
      res.status(404).json({ message: "Book not found.💥" });
    }
  } catch (error) {
    console.error("Error reducing stock:", error);
    res.status(500).json({ message: "Error reducing stock.💥" });
  }
});

// export default app;
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Catalog server is running on port ${port}...`);
});
