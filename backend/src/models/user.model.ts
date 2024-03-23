import bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';

type userType = {
  username: string;
  password: string;
};
export interface userDocument extends userType, Document {
  isPasswordCorrect(password: string): Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  generateAccessToken: Function;
}

const userSchema = new Schema<userDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next();
  // encrypting password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const User = model<userDocument>('User', userSchema);

export default User;
