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
    const productInfoSelector = "._2ZET87n8";
    yield page.waitForSelector(productInfoSelector);
    const card_data_el = yield page.$(productInfoSelector);
    const id = yield page.evaluate(() => {
        var _a;
        return ((_a = document.head
            .querySelector('meta[property="fb:app_id"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content")) || "";
    });
    const title = yield page.evaluate(() => {
        var _a;
        return ((_a = document.head
            .querySelector('meta[name="title"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content")) || "";
    });
    const body_html = yield page.evaluate(() => {
        var _a;
        return ((_a = document.head
            .querySelector('meta[property="og:description"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content")) || "";
    });
    const vendor = yield (card_data_el === null || card_data_el === void 0 ? void 0 : card_data_el.evaluate((el) => el.querySelector("#rightContent > div.HFooICRX._3p1wuyo2").innerText));
    const tags = yield (card_data_el === null || card_data_el === void 0 ? void 0 : card_data_el.evaluate((el) => el.querySelector("._2rn4tqXP").innerText));
    const getImageMetadata = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(imageUrl);
        const lastModified = response.headers.get("last-modified");
        const createDate = response.headers.get("Date");
        return {
            create_at: createDate,
            lastupdate_at: lastModified,
        };
    });
    const image_selector = "._2ftcdy74";
    yield page.waitForSelector(image_selector);
    const image_els = yield page.$$(image_selector);
    if (image_els.length > 0) {
        for (let img of image_els) {
            while (true) {
                try {
                    yield img.waitForSelector("img[src^='https'], img[data-src^='https']");
                    break;
                }
                catch (_a) { }
                yield (0, utils_1.default)(300);
            }
        }
    }
    const images = yield Promise.all(image_els.map((el, index) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield el.evaluate((item) => {
            const imgElement = item.querySelector("img");
            return {
                alt: imgElement.getAttribute("alt") || "",
                src: imgElement.getAttribute("src") ||
                    imgElement.getAttribute("data-src"),
                width: imgElement.naturalWidth,
                height: imgElement.naturalHeight,
            };
        });
        const { create_at, lastupdate_at } = yield getImageMetadata(data.src);
        return Object.assign(Object.assign({ id: "", position: index.toString() || "" }, data), { create_at,
            lastupdate_at });
    })));
    let product;
    const option_selector = "._3csHYvw1";
    const option_element = yield page.$(option_selector);
    if (option_element !== null) {
        product = yield option_element.evaluate((el) => {
            var _a, _b;
            const variantPriceElement = document.querySelector("._3cZnvUvE");
            const variantPrice = variantPriceElement !== null
                ? variantPriceElement.getAttribute("aria-label") || ""
                : "";
            const priceMatch = variantPrice.match(/\d+(\.\d+)?/g);
            const price = priceMatch ? priceMatch[0] : "";
            const title = ((_a = document.querySelector("._2zqZP145 > span > em")) === null || _a === void 0 ? void 0 : _a.innerHTML) || "";
            const currency = ((_b = document.querySelector("._3cZnvUvE > span:last-child")) === null || _b === void 0 ? void 0 : _b.innerHTML) || "";
            return {
                title,
                price,
                currency,
            };
        });
    }
    const elements_array = "._3mjWr5DX";
    let variants;
    if (yield page.waitForSelector(elements_array, { timeout: 1000 })
        .then(() => __awaiter(void 0, void 0, void 0, function* () { yield (0, utils_1.default)(1000); return 1; })).catch(() => 0)) {
        const element = yield page.$(elements_array);
        variants = yield (element === null || element === void 0 ? void 0 : element.evaluate((el) => {
            var _a, _b, _c;
            let variants = [];
            let id = ((_a = document.head
                .querySelector('meta[property="fb:app_id"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content")) || "";
            const elementArray = el.querySelectorAll("._2bzGqXzH");
            for (let i = 0; i < elementArray.length; ++i) {
                elementArray[i].click();
                const variantPriceElement = document.querySelector("._3cZnvUvE");
                const variantPrice = variantPriceElement !== null
                    ? variantPriceElement.getAttribute("aria-label") || ""
                    : "";
                const priceMatch = variantPrice.match(/\d+(\.\d+)?/g);
                const price = priceMatch ? priceMatch[0] : "";
                const option1 = (_b = document.querySelector("._2aXpqYRk > div > em")) === null || _b === void 0 ? void 0 : _b.innerHTML;
                const option2 = (_c = document.querySelector(".p9maYisg")) === null || _c === void 0 ? void 0 : _c.innerHTML;
                const image_url = elementArray[i]
                    .querySelector(".wxWpAMbp")
                    .getAttribute("src");
                variants.push({
                    id: id || "",
                    title: option1 || "",
                    price: price,
                    option1: option1 || "",
                    option2: option2 || "",
                    option3: "",
                    image_url: image_url || "",
                });
            }
            return variants;
        }));
    }
    const option1_selector = "._3mjWr5DX";
    let option1;
    if (yield page.waitForSelector(option1_selector, { timeout: 1000 })
        .then(() => __awaiter(void 0, void 0, void 0, function* () { yield (0, utils_1.default)(1000); return 1; })).catch(() => 0)) {
        const option1_element = yield page.$(option_selector);
        option1 = Object.assign({ id: "", product_id: id, position: "1" }, (yield (option1_element === null || option1_element === void 0 ? void 0 : option1_element.evaluate((el) => {
            var _a;
            return ({
                name: ((_a = document
                    .querySelector("._1yW2vOYd > div > div")) === null || _a === void 0 ? void 0 : _a.getAttribute("aria-label")) || "",
                values: Array.from(document.querySelectorAll("._2bzGqXzH")).map((variant) => variant.getAttribute("aria-label")),
            });
        }))));
    }
    const option2_selector = "._4kzxjBkE";
    let option2;
    if (yield page.waitForSelector(option2_selector, { timeout: 1000 })
        .then(() => __awaiter(void 0, void 0, void 0, function* () { yield (0, utils_1.default)(1000); return 1; })).catch(() => 0)) {
        const option2_element = yield page.$(option2_selector);
        option2 = Object.assign({ id: "", product_id: id, position: "2" }, yield (option2_element === null || option2_element === void 0 ? void 0 : option2_element.evaluate((el) => {
            var _a;
            return ({
                name: ((_a = document.querySelector(".aZN7lGU3")) === null || _a === void 0 ? void 0 : _a.getAttribute("aria-label")) || "",
                values: Array.from(document.querySelectorAll("._2MDh6s4q")).map((variant) => variant.getAttribute("aria-label"))
            });
        })));
    }
    const ProductData = {
        id,
        title,
        body_html,
        vendor,
        tags,
        currency: product === null || product === void 0 ? void 0 : product.currency,
        images,
        product,
        variants,
        options: [option1, option2],
    };
    return ProductData;
});
exports.getData = getData;
//# sourceMappingURL=getData.controller.js.map