import { Schema, model, type InferSchemaType } from "mongoose";

const localizedSchema = new Schema(
  {
    ar: { type: String, default: null },
    en: { type: String, default: null },
  },
  { _id: false },
);

const categorySchema = new Schema(
  {
    _id: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    name: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: { type: localizedSchema, default: () => ({ ar: null, en: null }) },
    sortOrder: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        const out = ret as Record<string, unknown>;
        out.id = out._id;
        delete out._id;
        return out;
      },
    },
  },
);

export type CategoryDocument = InferSchemaType<typeof categorySchema> & {
  _id: string;
};

export const CategoryModel = model("Category", categorySchema);
