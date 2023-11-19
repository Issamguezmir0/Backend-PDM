"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forgotPassword_controller_1 = __importDefault(require("../controller/forgotPassword-controller"));
const ChangePassword_1 = require("../controller/ChangePassword");
const router = express_1.default.Router();
router.post('/change-password', ChangePassword_1.changePassword);
router.post("/forgot-password", forgotPassword_controller_1.default.forgotPassword);
router.post("/verify-code", forgotPassword_controller_1.default.verifyCode);
router.post("/change-password", forgotPassword_controller_1.default.changePassword);
exports.default = router;
