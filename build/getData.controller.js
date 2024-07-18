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
exports.getData = void 0;
const getData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const header = yield page.evaluate(() => {
        var _a, _b;
        const title = ((_a = document.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent) || "";
        const description = ((_b = document.querySelector('div.module_title > div > h1')) === null || _b === void 0 ? void 0 : _b.innerHTML) || "";
        return {
            title,
            description
        };
    });
    const product = () => __awaiter(void 0, void 0, void 0, function* () {
        yield page.waitForSelector('#container > div.root > div.layout-body > div.layout-right > div > div > div > div.module_sku > div > div.sku-info > div:nth-child(2) > a:nth-child(1)', { timeout: 10000 });
        const module_dialog_element = yield page.$('#container > div.root > div.layout-body > div.layout-right > div > div > div > div.module_sku > div > div.sku-info > div:nth-child(2) > a:nth-child(1)');
        yield (module_dialog_element === null || module_dialog_element === void 0 ? void 0 : module_dialog_element.click());
        yield page.waitForSelector('.sku-dialog-content');
        const sku_module_element = yield page.$('.sku-dialog-content');
        const priceData = yield (sku_module_element === null || sku_module_element === void 0 ? void 0 : sku_module_element.evaluate((el) => {
            var _a, _b;
            const price = ((_b = (_a = el.querySelector('.product-price .price-list .price-item .price span')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
            return price;
        }));
        const options = yield (sku_module_element === null || sku_module_element === void 0 ? void 0 : sku_module_element.evaluate((el) => {
            var _a, _b, _c, _d, _e, _f;
            const option1_elements = document.querySelectorAll('div.sku-info > div:nth-child(2) > a.image');
            const option1 = Array.from(option1_elements).map((option) => {
                var _a, _b;
                option.click();
                const name = ((_a = el.querySelector('div.sku-info > h4:nth-child(1) > span')) === null || _a === void 0 ? void 0 : _a.innerHTML) || "";
                const img = ((_b = option.querySelector('img')) === null || _b === void 0 ? void 0 : _b.getAttribute('src')) || "";
                return { name, img };
            });
            const option1_name = ((_b = (_a = el.querySelector('div.sku-info > h4:nth-child(1)')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
            const option2_elements = document.querySelectorAll('div.sku-info > div:nth-child(4) > a');
            const option2 = Array.from(option2_elements).map((option) => {
                var _a;
                return ((_a = option.querySelector('span').textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null;
            });
            const option2_name = ((_d = (_c = el.querySelector('div.sku-info > h4:nth-child(3)')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) || "";
            const option3_elements = document.querySelectorAll('div.sku-info > div:nth-child(6) > a');
            const option3 = Array.from(option3_elements).map((option) => {
                var _a, _b;
                const type = ((_b = (_a = option.querySelector('span')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
                return type;
            });
            const option3_name = ((_f = (_e = el.querySelector('div.sku-info > h4:nth-child(5)')) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.trim()) || "";
            return {
                option1: { name: option1_name, value: option1 },
                option2: { name: option2_name, value: option2 },
                option3: { name: option3_name, value: option3 }
            };
        }));
        const variants = options === null || options === void 0 ? void 0 : options.option1.value.map((op1, op1_index) => {
            var _a, _b;
            return (_b = (_a = options.option2) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.map((op2, op2_index) => {
                return {
                    title: `${op1.name} / ${op2}`,
                    sku: `SKU-${(op1_index + 1) * (op2_index + 1)}`,
                    price: priceData,
                    compare_at_price: priceData,
                    option1: op1.name,
                    option2: op2,
                    option3: options.option3,
                    imgUrl: op1.img
                };
            });
        });
        console.log(variants);
        const vendorSelectors = ['.strong', '.logistic-item'];
        const vendor = yield getVendor(page, vendorSelectors);
        return { variants, priceData, options, vendor };
    });
    yield page.waitForSelector('.image-list-item', { visible: true });
    const images = yield page.evaluate(() => {
        const images = document.querySelectorAll('.image-list-item');
        return Array.from(images).map(img => img.getAttribute('src') || "");
    });
    const productResult = yield product();
    const ProductData = {
        title: header.title,
        vendor: productResult.vendor || undefined,
        description: header.description,
        price: productResult.priceData,
        options: [(_a = productResult.options) === null || _a === void 0 ? void 0 : _a.option1, (_b = productResult.options) === null || _b === void 0 ? void 0 : _b.option2, (_c = productResult.options) === null || _c === void 0 ? void 0 : _c.option3],
        variants: productResult.variants,
        images,
    };
    return ProductData;
});
exports.getData = getData;
const getVendor = (page, selectors) => __awaiter(void 0, void 0, void 0, function* () {
    for (const selector of selectors) {
        try {
            yield page.waitForSelector(selector, { visible: true, timeout: 1000 });
            const vendorElement = yield page.$(selector);
            if (vendorElement) {
                const vendorText = yield vendorElement.evaluate((el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
                if (vendorText) {
                    return vendorText;
                }
            }
        }
        catch (error) {
            console.error(`Error finding vendor element with selector ${selector}: ${error}`);
        }
    }
    return null;
});
//# sourceMappingURL=getData.controller.js.map