import { Router } from "express";
import { login, refresh, singup } from "../controllers/authController";

const router = Router();

router.post("/signup", singup);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;
