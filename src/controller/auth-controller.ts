import { Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import User from "../models/user";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

export const signupController = async (req: Request, res: Response) => {
  console.log("Request body:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    console.error(errors);
    return res.status(400).json({ message: errorMessage });
  }
  const { fullname, email, password, adresse, cin, num_tel } = req.body;
  console.log("Data before creating user:");
  console.log("fullname:", fullname);
  console.log("adresse:", adresse);
  console.log("email:", email);
  console.log("cin:", cin);

  console.log("num_tel:", num_tel);
  const existingUser = await User.getUser(email);
  if (existingUser !== User.empty) {
    return res.status(400).json({ message: "This email is already used" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const img = "example.jpg";
  const age = "11";
  const newUser = new User(
    fullname,
    adresse,
    email,
    cin,
    num_tel,
    hashedPassword,
    img,
    age
  );

  console.log("Data after creating user:");
  console.log("newUser:", newUser);

  const userId = await newUser.createUser();

  const token = jwt.sign({ email: email, userId: userId }, "mySecretKey", {
    expiresIn: "1h",
  });

  res.status(200).json({ token: token, userId: userId });
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }

    const { email, password } = req.body;
    const user = await User.getUser(email);

    if (user === User.empty) {
      return res
        .status(400)
        .json({ message: "No user found with this email, please sign up!" });
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res
        .status(400)
        .json({ message: "Wrong password, enter correct one." });
    }

    const token = jwt.sign(
      { user },

      "mySecretKey",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

dotenv.config();
export const authenticateProfile = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Non autorisé - Token manquant" });
    }

    // const jwtSecret = process.env.JWT_SECRET?.trim();

    // if (!jwtSecret) {
    //   console.error("La clé secrète JWT n'est pas définie.");
    //   return res.status(500).json({ message: "Erreur interne du serveur" });
    // }

    // console.log("Contenu du JWT :", token);
    // console.log("Clé secrète avant vérification du JWT :", jwtSecret);

    // Ajoutez l'algorithme explicite (HS256) lors de la vérification
    // const decoded = jwt.verify(token, "mySecretKey", {
    //   algorithms: ["HS256"],
    // }) as {
    //   id: string;
    // };

    // console.log("Décode du JWT :", decoded); // Pour débogage

    // const user = await User.getUserById(decoded.id);

    // if (User.isUserEmpty(user)) {
    //   return res.status(404).json({ message: "Utilisateur non trouvé" });
    // }

    // Renvoyer toutes les données de l'utilisateur dans la réponse JSON
    try {
      const decoded = jwt.verify(token, "mySecretKey");
      console.log("Decoded Payload:", decoded);
      return res.json(decoded);
    } catch (error) {
      console.error("Token verification failed:", error);
    }
    // return res.json({
    //   // id: user.id,
    //   // fullname: user.fullname,
    //   // adresse: user.adresse,
    //   // email: user.email,
    //   // cin: user.cin,
    //   // num_tel: user.num_tel,
    //   // img: user.img,
    //   // age: user.age,
    //   // ... ajoutez d'autres propriétés selon vos besoins
    // });
  } catch (error: any) {
    console.error(
      "Erreur lors de l'authentification du profil :",
      error.message
    );

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
