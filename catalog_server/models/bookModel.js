import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter the title!"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter the stock!"],
  },
  cost: {
    type: Number,
    required: [true, "Please enter the cost!"],
  },
  topic: {
    type: String,
    required: [true, "Please enter the topic!"],
  },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
