import mongoose, { Document, Model } from "mongoose";
import z from "zod";

export const AttributeZodSchema = z.object({
  name: z.string(),
  values: z.array(z.string()),
});

type AttributeType = z.infer<typeof AttributeZodSchema>;

interface AttributeInterface extends AttributeType, Document {}

const AttributeSchema = new mongoose.Schema<AttributeInterface>({
  name: {
    type: String,
    required: true,
  },
  values: {
    type: [String],
    required: true,
  },
});

const Attribute: Model<AttributeInterface> =
  mongoose.models.Attribute ||
  mongoose.model<AttributeInterface>("Attribute", AttributeSchema);

export default Attribute;
