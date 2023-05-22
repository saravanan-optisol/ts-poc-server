
import mongoose from "mongoose";
const schema = mongoose.Schema;

const ProfileSchema = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: 'users',
  },
  location: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  address: {
    type: String,
  },
  cart: [
    {
      product: {
        type: schema.Types.ObjectId,
        ref: 'produts',
      },
      name: {
        type: String,
      },
      imgsrc: {
        type: String,
      },
      prize: {
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  orders: [
    {
      product: {
        type: schema.Types.ObjectId,
        ref: 'produts',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Profile = mongoose.model('profile', ProfileSchema);
export default Profile;