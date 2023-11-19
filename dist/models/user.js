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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
class User {
    constructor(fullname, adresse, email, cin, num_tel, password, id) {
        this.id = id;
        this.fullname = fullname;
        this.adresse = adresse;
        this.email = email;
        this.cin = cin;
        this.num_tel = num_tel;
        this.password = password;
    }
    createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            delete this.id;
            const insertOneResult = yield db.collection("users").insertOne(Object.assign({}, this));
            return insertOneResult.insertedId.toString();
        });
    }
    static isUserEmpty(user) {
        return !user || !user.id;
    }
    updateResetCode(newResetCode, newResetCodeExpiration) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            if (!this.id) {
                throw new Error("User ID is not defined.");
            }
            const updateResult = yield db.collection("users").updateOne({ _id: new mongodb_1.ObjectId(this.id) }, {
                $set: {
                    resetCode: newResetCode,
                    resetCodeExpiration: newResetCodeExpiration,
                },
            });
            if (updateResult.modifiedCount !== 1) {
                throw new Error("Failed to update reset code.");
            }
            // Mettez également à jour les propriétés dans l'instance actuelle
            this.resetCode = newResetCode;
            this.resetCodeExpiration = newResetCodeExpiration;
        });
    }
    isResetCodeValid(resetCode, resetCodeExpiration) {
        return (!!this.resetCode &&
            !!this.resetCodeExpiration &&
            this.resetCode === resetCode &&
            this.resetCodeExpiration >= resetCodeExpiration);
    }
    static getUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Identifiant reçu dans getUser:", identifier);
            const db = database_1.Database.getDb();
            // Vérifier si l'identifiant est un e-mail ou un numéro de téléphone
            const isEmail = /\S+@\S+\.\S+/.test(identifier);
            const query = isEmail ? { email: identifier } : { num_tel: identifier };
            const document = yield db.collection("users").findOne(query);
            if (document != null) {
                return new User(document.fullname, document.adresse, document.num_tel, document.cin, document.email, document.password, document._id.toString());
            }
            else {
                console.log("Utilisateur non trouvé dans la base de données pour l'identifiant:", identifier);
                return User.empty;
            }
        });
    }
    /*static async getUserT(email: string): Promise<User> {
      console.log("Numéro de téléphone reçu dans getUserT:", email);
      const db: Db = Database.getDb();
      const document = await db.collection("users").findOne({ num_tel: email });
  
      console.log("Document trouvé dans la base de données:", document);
  
      if (document != null) {
        console.log(
          "Numéro de téléphone trouvé dans la base de données:",
          document.num_tel
        );
        return new User(
          document.fullname,
          document.adresse || "",
          document.num_tel || "",
          document.cin || "",
          document.email || "",
          document.password,
          document._id.toString()
        );
      } else {
        console.log("User not found for num_tel:", email);
        return User.empty;
      }
    }*/
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            try {
                const objectId = new mongodb_1.ObjectId(userId);
                const user = yield db.collection("users").findOne({ _id: objectId });
                if (user != null) {
                    return new User(user.fullname, user.adresse, user.email, user.cin, user.num_tel, user.password, user._id.toString());
                }
                else {
                    return User.empty;
                }
            }
            catch (error) {
                console.error("Error fetching user by ID:", error);
                throw error;
            }
        });
    }
    updatePassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            if (!this.id) {
                throw new Error("User ID is not defined.");
            }
            const updateResult = yield db
                .collection("users")
                .updateOne({ _id: new mongodb_1.ObjectId(this.id) }, { $set: { password: newPassword } });
            if (updateResult.modifiedCount !== 1) {
                throw new Error("Failed to update password.");
            }
        });
    }
}
User.empty = new User("", "", "", "", "", "", "");
exports.default = User;
