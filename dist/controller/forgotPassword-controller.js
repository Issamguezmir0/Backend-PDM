"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const crypto_1 = require("../utils/crypto");
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../database");
class ForgotPasswordController {
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { num_tel } = req.body;
                console.log("Numéro de téléphone reçu:", num_tel);
                const user = yield user_1.default.getUser(num_tel);
                console.log("Utilisateur trouvé:", user);
                if (user === user_1.default.empty) {
                    console.log("Utilisateur non trouvé. Retour à l'utilisateur non trouvé.");
                    return res.status(404).json({ message: "Utilisateur non trouvé." });
                }
                const resetCode = (0, crypto_1.generateResetCode)();
                const resetCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);
                yield user.updateResetCode(resetCode, resetCodeExpiration);
                console.log("Code de réinitialisation généré et enregistré:", resetCode);
                yield (0, crypto_1.sendSMS)(num_tel, `Votre code de réinitialisation est : ${resetCode}`);
                console.log("SMS envoyé avec succès.");
                return res.json({
                    message: "Code de réinitialisation envoyé avec succès.",
                });
            }
            catch (error) {
                console.error("Erreur lors de l'envoi du code de réinitialisation :", error);
                return res.status(500).json({
                    message: "Erreur serveur lors de la demande de réinitialisation.",
                });
            }
        });
    }
    static verifyCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { num_tel, resetCode } = req.body;
                const user = yield user_1.default.getUser(num_tel);
                console.log("Numéro de téléphone reçu:", num_tel);
                console.log("Utilisateur trouvé:", user);
                if (user_1.default.isUserEmpty(user) ||
                    !user.isResetCodeValid(resetCode, new Date())) {
                    console.log("Code de réinitialisation invalide ou expiré.");
                    console.log("Reset code in the database:", user.resetCode);
                    console.log("Reset code expiration in the database:", user.resetCodeExpiration);
                    res
                        .status(400)
                        .json({ message: "Code de réinitialisation invalide ou expiré." });
                    return;
                }
                console.log("Avant updateResetCode - Reset code in the database:", user.resetCode);
                console.log("Avant updateResetCode - Reset code expiration in the database:", user.resetCodeExpiration);
                yield user.updateResetCode("nouveauCode", new Date());
                console.log("Après updateResetCode - Reset code in the database:", user.resetCode);
                console.log("Après updateResetCode - Reset code expiration in the database:", user.resetCodeExpiration);
                console.log("Code de réinitialisation vérifié avec succès.");
                res.json({ message: "Code de réinitialisation vérifié avec succès." });
            }
            catch (error) {
                console.error("Erreur lors de la vérification du code de réinitialisation :", error);
                res.status(500).json({
                    message: "Erreur serveur lors de la vérification du code de réinitialisation.",
                });
            }
        });
    }
    static changedPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            try {
                const { num_tel, newPassword } = req.body;
                const user = yield user_1.default.getUserByNumTel(num_tel);
                if (user_1.default.isUserEmpty(user)) {
                    res.status(404).json({ message: "Utilisateur non trouvé." });
                    return;
                }
                const newHashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                const updateResult = yield db
                    .collection("users")
                    .updateOne({ _id: new mongodb_1.ObjectId(user.id) }, { $set: { password: newHashedPassword } });
                res.json({ message: "Mot de passe réinitialisé avec succès." });
            }
            catch (error) {
                console.error("Erreur lors de la réinitialisation du mot de passe :", error);
                res.status(500).json({
                    message: "Erreur serveur lors de la réinitialisation du mot de passe.",
                });
            }
        });
    }
}
exports.default = ForgotPasswordController;
