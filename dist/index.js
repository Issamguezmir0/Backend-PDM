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
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_middlware_1 = __importDefault(require("./middlware/error.middlware"));
const config_1 = __importDefault(require("./config"));
const database_1 = require("./database");
console.log(config_1.default);
const PORT = config_1.default.port || 3000;
// create instance server
const app = (0, express_1.default)();
//middlware to parser incomming request
app.use(express_1.default.json());
//http request logger middlware
app.use((0, morgan_1.default)("common"));
//http security middlware
app.use((0, helmet_1.default)());
//apply the rate limitting middlware to all request
app.use((0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP , please try again after an hour",
}));
app.use(error_middlware_1.default);
function databaseInit() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.Database.initilize();
        //start express server
        app.listen(PORT, () => {
            console.log(`Server is running on port : ${PORT}`);
        });
    });
}
exports.default = app;
