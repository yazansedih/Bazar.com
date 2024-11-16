import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://Abdallah:12345@cluster0.njict.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB.");
    seedDatabase(); // Start seeding
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const bookSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  stock: Number,
  cost: Number,
  topic: String,
});

const Book = mongoose.model("Book", bookSchema);

const books = [
  {
    _id: 1,
    title: "How to get a good grade in DOS in 40 minutes a day",
    stock: 10,
    cost: 29.99,
    topic: "distributed systems",
  },
  {
    _id: 2,
    title: "RPCs for Noobs",
    stock: 5,
    cost: 19.99,
    topic: "distributed systems",
  },
  {
    _id: 3,
    title: "Xen and the Art of Surviving Undergraduate School",
    stock: 3,
    cost: 24.99,
    topic: "undergraduate school",
  },
  {
    _id: 4,
    title: "Cooking for the Impatient Undergrad",
    stock: 8,
    cost: 14.99,
    topic: "undergraduate school",
  },
];

async function seedDatabase() {
  try {
    await Book.deleteMany({});
    console.log("Existing books removed.");

    await Book.insertMany(books);
    console.log("Books added to database.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}
