import mongoose from "mongoose";
import express from "express";

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://Abdallah:12345@cluster0.njict.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB."))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(express.json());

//schema for the book collection
const bookSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  stock: Number,
  cost: Number,
  topic: String,
});

const Book = mongoose.model("Book", bookSchema);

app.get("/api/v1/bazar", (req, res) => {
  res.status(200).json("Welcome to Bazar from catalog server.😁");
});

app.get("/api/v1/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books.💥" });
  }
});

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

app.get("/api/v1/info/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  if (isNaN(bookId)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const book = await Book.findOne({ _id: bookId });

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

  if (isNaN(id) || stock == null) {
    return res.status(400).json({ message: "Invalid book ID or stock value" });
  }

  try {
    const book = await Book.findOneAndUpdate(
      { _id: id },
      { stock },
      { new: true }
    );
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

  if (isNaN(id) || cost == null) {
    return res.status(400).json({ message: "Invalid book ID or cost value" });
  }

  try {
    const book = await Book.findOneAndUpdate(
      { _id: id },
      { cost },
      { new: true }
    );
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

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const book = await Book.findOne({ _id: id });
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

// Start the catalog server
app.listen(PORT, () => {
  console.log(`Catalog server is running on port ${PORT}`);
});
