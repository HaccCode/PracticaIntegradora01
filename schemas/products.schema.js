import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  
  status: True,

  stock: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  thumbnails: {
    type: Array,
  },
});

export default mongoose.model("Products", ProductsSchema);
