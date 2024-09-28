import mongoose, { Document, Model, Schema } from "mongoose";

interface UserInterface extends Document {
  email: string;
  name: string;
  role: string;
}

const UserSchema = new Schema<UserInterface>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
});

const User: Model<UserInterface> =
  mongoose.models.User || mongoose.model<UserInterface>("User", UserSchema);
export default User;
