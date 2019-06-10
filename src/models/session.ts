import mongoose, { Document } from "mongoose";
import uuidv1 from "uuid/v1";

const Schema = mongoose.Schema;

export interface ISession extends Document {
  _id: string;
  user: string;
  expiration: Date;
}

const SessionSchema = new Schema({
  _id: {type: String, default: uuidv1},
  user: String,
  expiration: {
    type: Date,
    default: Date.now() + 60000 * 60 * 24,
    expires: (60000 * 60 * 24),
  },
});

export const Session = mongoose.model<ISession>("session", SessionSchema);
