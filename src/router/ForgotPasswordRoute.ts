import express from "express";
import ForgotPasswordController from "../controller/forgotPassword-controller";
import { changePassword } from "../controller/ChangePassword";

const router = express.Router();

router.post("/change-password", changePassword);
router.post("/forgot-password", ForgotPasswordController.forgotPassword);
router.post("/verify-code", ForgotPasswordController.verifyCode);
router.post("/forgotpasswordfinal", ForgotPasswordController.changedPassword);

export default router;
