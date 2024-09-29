import mongoose, { Document, Model } from "mongoose";

type AttributeType = {
  name: string;
  value: string;
};

interface AttributeInterface extends AttributeType, Document {}

const AttributeSchema = new mongoose.Schema<AttributeInterface>({});

const Attribute: Model<AttributeInterface> =
  mongoose.models.Attribute ||
  mongoose.model<AttributeInterface>("Attribute", AttributeSchema);

export default Attribute;
