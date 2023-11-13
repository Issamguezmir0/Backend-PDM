import { doc } from "prettier";
import { Database } from "../database";
import { Db } from "mongodb";

class User {
  id?: string;
  fullname: string;
  adresse: string;
  email: string;
  cin: string;
  num_tel: string;
  password: string;

  constructor(
    fullname: string,
    adresse: string,
    email: string,
    cin: string,
    num_tel: string,
    password: string,
    id?: string
  ) {
    this.id = id;
    this.fullname = fullname;
    this.adresse = adresse;
    this.email = email;
    this.cin = cin;
    this.num_tel = num_tel;
    this.password = password;
  }

  async createUser() {
    const db: Db = Database.getDb();
    delete this.id;
    const insertOneResult = await db.collection("users").insertOne({ ...this });
    return insertOneResult.insertedId.toString();
  }

  static empty = new User("", "", "", "", "", "", "");

  static async getUser(email: string) {
    const db: Db = Database.getDb();
    const document = await db.collection("users").findOne({ email: email });
    if (document != null) {
      return new User(
        document.fullname,
        document.adresse,
        document.email,
        document.cin,
        document.email,
        document.password,
        document._id.toString()
      );
    } else {
      return User.empty;
    }
  }
}

export default User;
