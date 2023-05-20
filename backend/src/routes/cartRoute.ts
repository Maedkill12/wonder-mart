import { Router } from "express";
import {
  addItem,
  clearCart,
  deleteItem,
  getCart,
  updateItem,
} from "../controllers/cartController";

const router = Router();

router.route("/:id").get(getCart).delete(clearCart).post(addItem);
router.route("/:cartId/:productId").put(updateItem).delete(deleteItem);

export default router;
