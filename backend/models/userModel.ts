import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id?:string,
    name?: string;
    email?: string;
    password?: string;
    profile_img?: string;
    address?: {
      coords?: {
        lat?: Number,
        lng?: Number,
      }
      street?: string,
      address1?: string;
      address2?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    profile_img: {
      type: String,
      // required: true
    },
    address: {
      coords: {
        lat: Number,
        lng: Number,
      },
      street: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      }
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
