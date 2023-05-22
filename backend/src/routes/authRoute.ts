import { Router } from "express";
import { login, refresh, singup } from "../controllers/authController";
import authentication from "../middlewares/authentication";

const router = Router();

router.post("/signup", singup);
router.post("/login", login);
router.post("/refresh", authentication, refresh);

export default router;
