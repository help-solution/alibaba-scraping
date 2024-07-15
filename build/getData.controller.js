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
exports.getData = void 0;
const utils_1 = __importDefault(require("./utils"));
const getData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const header = yield page.evaluate(() => {
        var _a, _b, _c;
        const id = ((_a = document.querySelector('head > meta:nth-child(6)')) === null || _a === void 0 ? void 0 : _a.getAttribute('content')) || "";
        const title = ((_b = document.querySelector('title')) === null || _b === void 0 ? void 0 : _b.textContent) || "";
        const body_html = ((_c = document.querySelector('meta[http-equiv="origin-trial"]')) === null || _c === void 0 ? void 0 : _c.getAttribute("content")) || "";
        return {
            id,
            title,
            body_html,
        };
    });
    const product = () => __awaiter(void 0, void 0, void 0, function* () {
        yield page.waitForSelector('#container > div.root > div.layout-body > div.layout-right > div > div > div > div.module_sku > div > div.sku-info > div:nth-child(2) > a:nth-child(1)', { timeout: 10000 });
        const module_dialog_element = yield page.$('#container > div.root > div.layout-body > div.layout-right > div > div > div > div.module_sku > div > div.sku-info > div:nth-child(2) > a:nth-child(1)');
        yield (module_dialog_element === null || module_dialog_element === void 0 ? void 0 : module_dialog_element.click());
        yield page.waitForSelector('.sku-dialog-content');
        const sku_module_element = yield page.$('.sku-dialog-content');
        const priceData = yield (sku_module_element === null || sku_module_element === void 0 ? void 0 : sku_module_element.evaluate((el) => {
            const priceItems = [];
            const elements = el.querySelectorAll('.product-price .price-list .price-item');
            elements.forEach((element) => {
                var _a, _b, _c, _d;
                const qualityElement = ((_b = (_a = element.querySelector('.quality')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
                const priceElement = ((_d = (_c = element.querySelector('.price span')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) || "";
                priceItems.push({ quality: qualityElement, price: priceElement });
            });
            return priceItems;
        }));
        const options = yield (sku_module_element === null || sku_module_element === void 0 ? void 0 : sku_module_element.evaluate((el) => {
            const option1_elements = el.querySelectorAll('div.sku-layout.logistics > div.sku-info > div:nth-child(2) > a.image');
            const option1 = Array.from(option1_elements).map((option) => {
                var _a, _b;
                option.click();
                const name = ((_a = el.querySelector('div.sku-layout.logistics > div.sku-info > h4:nth-child(1) > span')) === null || _a === void 0 ? void 0 : _a.innerHTML) || "";
                const img = ((_b = option.querySelector('img')) === null || _b === void 0 ? void 0 : _b.getAttribute('src')) || "";
                return { name, img };
            });
            const option2Element = el.querySelector('div.sku-layout.logistics > div.sku-info > div:nth-child(4) > a > span');
            const option2 = option2Element ? option2Element.innerHTML : null;
            const option3_elements = el.querySelectorAll('.last-sku-item');
            const option3 = Array.from(option3_elements).map((option) => {
                var _a, _b;
                const type = ((_a = option.querySelector('span.last-sku-first-item > span > span')) === null || _a === void 0 ? void 0 : _a.innerHTML) || "";
                const price = ((_b = option.querySelector('span.price')) === null || _b === void 0 ? void 0 : _b.innerHTML) || "";
                return { type, price };
            });
            return { option1, option2, option3 };
        }));
        yield (0, utils_1.default)(1000);
        yield (sku_module_element === null || sku_module_element === void 0 ? void 0 : sku_module_element.waitForSelector('.strong', { visible: true }));
        const vendor_element = yield (sku_module_element === null || sku_module_element === void 0 ? void 0 : sku_module_element.$('.strong'));
        const vendor = yield (vendor_element === null || vendor_element === void 0 ? void 0 : vendor_element.evaluate((el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; }));
        return { priceData, options, vendor };
    });
    yield page.waitForSelector('.image-list-item', { visible: true });
    const images = yield page.evaluate(() => {
        const images = document.querySelectorAll('.image-list-item');
        return Array.from(images).map(img => img.getAttribute('src') || "");
    });
    const productResult = yield product();
    const getImageMetadata = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(imageUrl);
        const lastModified = response.headers.get("last-modified");
        const createDate = response.headers.get("Date");
        return {
            create_at: createDate || "",
            lastupdate_at: lastModified || "",
        };
    });
    const productMetaInfo = yield Promise.all(((_b = (_a = productResult.options) === null || _a === void 0 ? void 0 : _a.option1) !== null && _b !== void 0 ? _b : []).map((option) => __awaiter(void 0, void 0, void 0, function* () {
        const metaData = yield getImageMetadata(option.img);
        return {
            name: option.name,
            img: option.img,
            create_at: metaData.create_at,
            lastupdate_at: metaData.lastupdate_at,
        };
    })));
    const ProductData = {
        id: header.id,
        title: header.title,
        body_html: header.body_html,
        vendor: productResult.vendor || undefined,
        images,
        price: productResult.priceData,
        product: productMetaInfo,
        options: {
            option2: ((_c = productResult.options) === null || _c === void 0 ? void 0 : _c.option2) || null,
            option3: (_d = productResult.options) === null || _d === void 0 ? void 0 : _d.option3,
        },
    };
    return ProductData;
});
exports.getData = getData;
//# sourceMappingURL=getData.controller.js.map