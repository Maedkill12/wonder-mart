import { Router } from "express";
import {
  deleteShipping,
  getShipping,
  updateShipping,
} from "../controllers/shippingController";

const router = Router();

router
  .route("/:id")
  .get(getShipping)
  .put(updateShipping)
  .delete(deleteShipping);

export default router;
