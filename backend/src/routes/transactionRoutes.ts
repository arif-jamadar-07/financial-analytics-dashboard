import express from "express";

import {
  getTransactions,
  getTransactionFilterOptions,
  getAnalytics,
  exportTransactions,
} from "../controllers/transactionController";


import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/options",
  authMiddleware,
  getTransactionFilterOptions
);

router.get(
  "/analytics",
  authMiddleware,
  getAnalytics
);

router.post(
  "/export",
  authMiddleware,
  exportTransactions
);


router.get(
  "/",
  authMiddleware,
  getTransactions
);

export default router;