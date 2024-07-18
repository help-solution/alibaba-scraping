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
exports.scrapAlibabaProduct = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const getData_controller_1 = require("./getData.controller");
const scrapAlibabaProduct = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Scraping data...");
        const browser = yield puppeteer_extra_1.default.launch({
            headless: false
        });
        const page = yield browser.newPage();
        yield page.goto(url, { waitUntil: "domcontentloaded" });
        const productResult = yield (0, getData_controller_1.getData)(page);
        return productResult;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
            return error;
        }
        else {
            console.error("Unexpected error:", error);
            return new Error("Unexpected error occurred");
        }
    }
});
exports.scrapAlibabaProduct = scrapAlibabaProduct;
//# sourceMappingURL=index.js.map