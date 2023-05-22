import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  prize: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  information: {
    type: String,
    required: true,
  },
  imgsrc: {
    type: String,
    required: true,
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('product', ProductSchema);
export default Product;
