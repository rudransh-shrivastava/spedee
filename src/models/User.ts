import mongoose, { Document, Model, Schema } from "mongoose";

type Address = {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};
interface UserInterface extends Document {
  id: string;
  email: string;
  name: string;
  role: string;
  defaultAddress?: Address;
  addresses?: Address[];
}

const UserSchema = new Schema<UserInterface>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  defaultAddress: {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    phone: { type: String },
  },
  addresses: [
    {
      name: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      phone: { type: String },
    },
  ],
});

const User: Model<UserInterface> =
  mongoose.models.User || mongoose.model<UserInterface>("User", UserSchema);
export default User;
