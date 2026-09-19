import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    date: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Revenue", "Expense"],
    },

    status: {
      type: String,
      required: true,
      enum: ["Paid", "Pending"],
    },

    user_id: {
      type: String,
      required: true,
    },

    user_profile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);

export default Transaction;
