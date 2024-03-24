import { Schema, Types, model } from 'mongoose';

type accountType = {
  userId: { prototype: Types.ObjectId };
  balance: number;
};

const accountSchema = new Schema<accountType>({
  userId: {
    type: Types.ObjectId,
    ref: 'paytm-user',
  },

  balance: {
    type: Number,
    required: true,
  },
});

const Account = model<accountType>('paytm-account', accountSchema);

export default Account;
