import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password?: string; // Optional for social logins
  verifyCode?: string; // Optional for social logins
  verifyCodeExpiry?: Date | null; // Allow null for social logins
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Types.DocumentArray<Message>;
}

const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: function () {
      // Password is required only for non-social logins
      return !this.isVerified;
    },
  },
  verifyCode: {
    type: String,
    required: function () {
      // Verify code is required only for email verification
      return !this.isVerified;
    },
  },
  verifyCodeExpiry: {
    type: Date,
    required: function () {
      // Verify code expiry is required only for email verification
      return !this.isVerified;
    },
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema], // Embedded sub-document array
});

// Create the model if it doesn't already exist
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default UserModel;
