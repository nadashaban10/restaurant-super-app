import { Schema, model, type InferSchemaType } from "mongoose";

const localizedSchema = new Schema(
  {
    ar: { type: String, default: null },
    en: { type: String, default: null },
  },
  { _id: false },
);

const variantSchema = new Schema(
  {
    id: { type: String, required: true },
    code: { type: String, required: true },
    name: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    priceAmount: { type: Number, required: true, min: 0 },
    priceEgp: { type: Number, required: true, min: 0 },
    isImplicit: { type: Boolean, required: true, default: false },
    sortOrder: { type: Number, required: true, default: 0 },
    isDefault: { type: Boolean, required: true, default: false },
  },
  { _id: false },
);

const imageSchema = new Schema(
  {
    src: { type: String, required: true },
    sourceFile: { type: String },
    alt: {
      ar: { type: String },
      en: { type: String },
    },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    _id: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    categoryId: { type: String, required: true, index: true },
    title: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: { type: localizedSchema, default: () => ({ ar: null, en: null }) },
    status: {
      type: String,
      enum: ["unpublished", "published", "deleted"],
      required: true,
      default: "unpublished",
      index: true,
    },
    isAvailable: { type: Boolean, required: true, default: true },
    currency: { type: String, enum: ["EGP"], required: true, default: "EGP" },
    discountType: {
      type: String,
      enum: ["none", "percent", "fixed"],
      required: true,
      default: "none",
    },
    discountValue: { type: Number, required: true, default: 0 },
    defaultVariantId: { type: String, required: true },
    variants: { type: [variantSchema], required: true, validate: [(v: unknown[]) => v.length > 0, "At least one variant"] },
    images: { type: [imageSchema], default: [] },
    sortOrder: { type: Number, required: true, default: 0 },
    featuredOnHome: { type: Boolean, required: true, default: false },
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

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: string;
};

export const ProductModel = model("Product", productSchema);
