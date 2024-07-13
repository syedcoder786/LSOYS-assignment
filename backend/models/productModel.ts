import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for RenterDetails
interface IRenterDetails extends Document {
  renter?: mongoose.Schema.Types.ObjectId | null;
  days?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// TypeScript interface for Product
interface IProduct extends Document {
  _id?:string,
  owner?: mongoose.Schema.Types.ObjectId;
  renterDetails?: IRenterDetails;
  imageUrl?: string;
  title?: string;
  price?: number;
  description?: string;
  available?: boolean;
  approved?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Sub-schema for RenterDetails with timestamps
const renterDetailsSchema = new Schema<IRenterDetails>(
  {
    renter: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      default: null,
    },
    days: {
      type: Number,
    },
  },
  {
    timestamps: true, // Enable timestamps for this subdocument
  }
);

// Main schema for Product
const productSchema = new Schema<IProduct>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true,
    },
    renterDetails: renterDetailsSchema,
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Enable timestamps for the main document
  }
);

// Mongoose model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
export type { IProduct, IRenterDetails };
