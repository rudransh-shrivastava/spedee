import mongoose, { Document, Model } from "mongoose";

interface AttributeInterface extends Document {}

const AttributeSchema = new mongoose.Schema<AttributeInterface>({});

const Attribute: Model<AttributeInterface> =
  mongoose.models.Attribute ||
  mongoose.model<AttributeInterface>("Attribute", AttributeSchema);

export default Attribute;
