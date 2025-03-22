import { Router } from "express";
import { loginUser, logoutUser, protectedRoute, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// router.use(verifyJWT); // Apply middleware to all routes in this file

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/dashboard").get(verifyJWT, protectedRoute);

router.route("/logout").get(verifyJWT, logoutUser); // Apply middleware to specific route

export default router;