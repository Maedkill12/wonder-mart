import { Router } from "express";
import {
  deletePayment,
  getPayment,
  updatePayment,
} from "../controllers/paymentController";

const router = Router();

router.route("/:id").get(getPayment).put(updatePayment).delete(deletePayment);

export default router;
