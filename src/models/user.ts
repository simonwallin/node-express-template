import mongoose, { Document } from "mongoose";
import uuidv1 from "uuid/v1";

const Schema = mongoose.Schema;

export interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  created: Date;
}

const UserSchema = new Schema({
  _id: {type: String, default: uuidv1},
  username: { type: String, unique: true, dropDups: true, required: true },
  password: String,
  created: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>("user", UserSchema);
