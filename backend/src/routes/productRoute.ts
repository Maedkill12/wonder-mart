import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController";
import authentication from "../middlewares/authentication";

const router = Router();

router.route("/").get(getAllProducts).post(authentication, createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(authentication, updateProduct)
  .delete(authentication, deleteProduct);

export default router;
