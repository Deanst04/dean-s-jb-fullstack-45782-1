import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  stock: number;
}

export interface ProductDocument extends IProduct, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductModel: Model<ProductDocument> = mongoose.model<ProductDocument>(
  "Product",
  productSchema
);
