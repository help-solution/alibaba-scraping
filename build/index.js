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
exports.scrapTemuProduct = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const getData_controller_1 = require("./getData.controller");
const utils_1 = __importDefault(require("./utils"));
const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_2a5e82db-zone-web_unlocker1:m47tpduqy4ji@brd.superproxy.io:22225';
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
const scrapTemuProduct = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Scraping data...");
        const browser = yield puppeteer_extra_1.default.connect({
            browserWSEndpoint: SBR_WS_ENDPOINT
        });
        const page = yield browser.newPage();
        yield page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        yield page.waitForSelector("._3E4sGl93", { timeout: 10000 }).catch(() => console.log("Accept button not found"));
        const acceptAll = yield page.$("._3E4sGl93");
        if (acceptAll) {
            yield acceptAll.evaluate((accept) => accept.click());
        }
        yield (0, utils_1.default)(1000);
        const productResult = yield (0, getData_controller_1.getData)(page);
        yield browser.close();
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
exports.scrapTemuProduct = scrapTemuProduct;
//# sourceMappingURL=index.js.map