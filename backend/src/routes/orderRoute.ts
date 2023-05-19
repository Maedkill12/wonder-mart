import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "../controllers/orderController";

const router = Router();

router.route("/").post(createOrder).get(getAllOrders);
router.route("/:id").get(getOrder).put(updateOrder).delete(deleteOrder);

export default router;
