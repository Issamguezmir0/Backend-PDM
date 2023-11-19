import { Request, Response } from "express";
import User from "../models/user";
import { generateResetCode, sendSMS } from "../utils/crypto";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { Database } from "../database";
import { Db } from "mongodb";
class ForgotPasswordController {
  static async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { num_tel } = req.body;

      console.log("Numéro de téléphone reçu:", num_tel);

      const user = await User.getUser(num_tel);

      console.log("Utilisateur trouvé:", user);

      if (user === User.empty) {
        console.log(
          "Utilisateur non trouvé. Retour à l'utilisateur non trouvé."
        );
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      const resetCode = generateResetCode();
      const resetCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);

      await user.updateResetCode(resetCode, resetCodeExpiration);

      console.log("Code de réinitialisation généré et enregistré:", resetCode);

      await sendSMS(
        num_tel,
        `Votre code de réinitialisation est : ${resetCode}`
      );

      console.log("SMS envoyé avec succès.");

      return res.json({
        message: "Code de réinitialisation envoyé avec succès.",
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi du code de réinitialisation :",
        error
      );

      return res.status(500).json({
        message: "Erreur serveur lors de la demande de réinitialisation.",
      });
    }
  }

  static async verifyCode(req: Request, res: Response): Promise<void> {
    try {
      const { num_tel, resetCode } = req.body;
      const user = await User.getUser(num_tel);

      console.log("Numéro de téléphone reçu:", num_tel);
      console.log("Utilisateur trouvé:", user);

      if (
        User.isUserEmpty(user) ||
        !user.isResetCodeValid(resetCode, new Date())
      ) {
        console.log("Code de réinitialisation invalide ou expiré.");
        console.log("Reset code in the database:", user.resetCode);
        console.log(
          "Reset code expiration in the database:",
          user.resetCodeExpiration
        );

        res
          .status(400)
          .json({ message: "Code de réinitialisation invalide ou expiré." });
        return;
      }

      console.log(
        "Avant updateResetCode - Reset code in the database:",
        user.resetCode
      );
      console.log(
        "Avant updateResetCode - Reset code expiration in the database:",
        user.resetCodeExpiration
      );

      await user.updateResetCode("nouveauCode", new Date());

      console.log(
        "Après updateResetCode - Reset code in the database:",
        user.resetCode
      );
      console.log(
        "Après updateResetCode - Reset code expiration in the database:",
        user.resetCodeExpiration
      );

      console.log("Code de réinitialisation vérifié avec succès.");
      res.json({ message: "Code de réinitialisation vérifié avec succès." });
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du code de réinitialisation :",
        error
      );
      res.status(500).json({
        message:
          "Erreur serveur lors de la vérification du code de réinitialisation.",
      });
    }
  }

  static async changedPassword(req: Request, res: Response): Promise<void> {
    const db: Db = Database.getDb();

    try {
      const { num_tel, newPassword } = req.body;


      const user = await User.getUserByNumTel(num_tel);

      if (User.isUserEmpty(user)) {
        res.status(404).json({ message: "Utilisateur non trouvé." });
        return;
      }
      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      const updateResult = await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(user.id) },
          { $set: { password: newHashedPassword } }
        );
      
      res.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe :",
        error
      );
      res.status(500).json({
        message: "Erreur serveur lors de la réinitialisation du mot de passe.",
      });
    }
  }
}

export default ForgotPasswordController;
