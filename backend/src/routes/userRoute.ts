import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController";

const router = Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
