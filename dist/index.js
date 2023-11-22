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
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const auth_router_1 = __importDefault(require("./router/auth-router"));
const cors_1 = __importDefault(require("cors"));
const ForgotPasswordRoute_1 = __importDefault(require("./router/ForgotPasswordRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
const home_router_1 = __importDefault(require("./router/home-router"));
const challenge_router_1 = __importDefault(require("./router/challenge-router"));
const app = (0, express_1.default)();
require("dotenv").config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/public", express_1.default.static("public"));
app.use("/home", home_router_1.default);
app.use("/auth", auth_router_1.default);
app.use("/challenge", challenge_router_1.default);
app.use("/password", ForgotPasswordRoute_1.default);
databaseInit();
function databaseInit() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.Database.initilize();
        app.listen(3002);
    });
}
