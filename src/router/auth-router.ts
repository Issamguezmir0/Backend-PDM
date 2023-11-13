import { Router } from "express";
import * as authController from "../controller/auth-controller";
import { body } from "express-validator";

const router = Router();

router.put(
  "/signup",
  [
    body("fullname")
      .trim()
      .isLength({ min: 6 })
      .withMessage("too small fullname"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid Email")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Too small password"),
  ],
  authController.signupController
);

router.post(
  "/signin",
  [
    body("fullname")
      .trim()
      .isLength({ min: 6 })
      .withMessage("too small fullname"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid Email")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Too small password"),
  ],
  authController.loginController
);

export default router;
