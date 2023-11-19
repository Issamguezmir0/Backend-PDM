"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.signupController = void 0;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signupController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
      const errorMessage = error.array()[0].msg;
      console.log(error);
      res.status(400).json({ message: errorMessage });
      return;
    }
    const { fullname, email, password, adresse, cin, num_tel } = req.body;
    const user = yield user_1.default.getUser(email);
    if (user !== user_1.default.empty) {
      res.status(400).json({ message: "This email is already used" });
      return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    const newUser = new user_1.default(
      fullname,
      email,
      adresse,
      cin,
      num_tel,
      hashedPassword
    );
    const userId = yield newUser.createUser();
    const token = jsonwebtoken_1.default.sign(
      { email: email, userId: userId },
      "mySecretKey",
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ token: token, userId: userId });
  });
exports.signupController = signupController;
const loginController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
      const errorMessage = error.array()[0].msg;
      res.status(400).json({ message: "errorMessage" });
      return;
    }
    const { email, password } = req.body;
    const user = yield user_1.default.getUser(email);
    if (user === user_1.default.empty) {
      res
        .status(400)
        .json({ message: "No user found with this email , Please sign up!" });
      return;
    }
    const isEqual = yield bcryptjs_1.default.compare(password, user.password);
    if (!isEqual) {
      res.status(400).json({ message: "Wrong password , enter correct one." });
    }
    const token = jsonwebtoken_1.default.sign(
      {
        email: email,
        userId: user.id,
      },
      "mySecretKey",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: user.id });
  });
exports.loginController = loginController;
