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
const utils_1 = __importDefault(require("./utils"));
const jimp_1 = __importDefault(require("jimp"));
const opencv_wasm_1 = require("opencv-wasm");
const skipCaptcha = (page) => __awaiter(void 0, void 0, void 0, function* () {
    yield clickVerifyButton(page);
    const images = yield getCaptchaImages(page);
    if (images) {
        yield images.original.writeAsync('./original.png');
        yield images.captcha.writeAsync('./captcha.png');
        const position = yield findCaptchaPosition(images);
        if (position) {
            console.log(`Captcha position: x=${position.x}, y=${position.y}`);
            yield moveCatpchaPosition(page, position);
        }
    }
});
function clickVerifyButton(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector('#img-button');
        const handleElement = yield page.$('#img-button');
        const handleBox = yield (handleElement === null || handleElement === void 0 ? void 0 : handleElement.boundingBox());
        if (handleBox)
            yield page.mouse.move((handleBox === null || handleBox === void 0 ? void 0 : handleBox.x) + (handleBox === null || handleBox === void 0 ? void 0 : handleBox.width) / 2, handleBox.y + handleBox.height / 2);
        yield page.mouse.down();
        yield page.waitForSelector('._1koncRW0', { visible: true });
        yield (0, utils_1.default)(1000);
    });
}
function getCaptchaImages(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const images = yield page.$$eval('._2Uvfc2fQ img', (imgs) => {
                return imgs.map((img) => {
                    const src = img.getAttribute('src');
                    if (src && src.startsWith('data:image/')) {
                        return src.replace(/^data:image\/\w+;base64,/, '');
                    }
                    return null;
                }).filter(Boolean);
            });
            if (images.length !== 2) {
                throw new Error('Expected exactly 2 images.');
            }
            const buffers = images.map((img) => Buffer.from(img, 'base64'));
            if (buffers[0] && buffers[1]) {
                const original = yield jimp_1.default.read(buffers[0]);
                const captcha = yield jimp_1.default.read(buffers[1]);
                return { captcha, original };
            }
            else {
                throw new Error('One of the buffers is null.');
            }
        }
        catch (e) {
            console.error("Error getting images:", e);
            throw e;
        }
    });
}
function findCaptchaPosition(images) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const originalMat = opencv_wasm_1.cv.matFromImageData(images.original.bitmap);
            const captchaMat = opencv_wasm_1.cv.matFromImageData(images.captcha.bitmap);
            const grayOriginal = new opencv_wasm_1.cv.Mat();
            const grayCaptcha = new opencv_wasm_1.cv.Mat();
            opencv_wasm_1.cv.cvtColor(originalMat, grayOriginal, opencv_wasm_1.cv.COLOR_RGBA2GRAY);
            opencv_wasm_1.cv.cvtColor(captchaMat, grayCaptcha, opencv_wasm_1.cv.COLOR_RGBA2GRAY);
            const matched = new opencv_wasm_1.cv.Mat();
            opencv_wasm_1.cv.matchTemplate(grayOriginal, grayCaptcha, matched, opencv_wasm_1.cv.TM_CCOEFF_NORMED);
            const minMax = opencv_wasm_1.cv.minMaxLoc(matched);
            const { maxLoc: { x, y } } = minMax;
            grayOriginal.delete();
            grayCaptcha.delete();
            matched.delete();
            return { x, y };
        }
        catch (e) {
            console.error("Error finding captcha position:", e);
            throw e;
        }
    });
}
function moveCatpchaPosition(page, position) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector('#slider');
        const sliderElement = yield page.$('#slider');
        const sliderBox = yield (sliderElement === null || sliderElement === void 0 ? void 0 : sliderElement.boundingBox());
        if (sliderBox) {
            const xpos = position.x;
            const ypos = sliderBox.y + sliderBox.height / 2;
            yield page.mouse.move(xpos, ypos);
            yield page.mouse.up();
        }
    });
}
exports.default = skipCaptcha;
//# sourceMappingURL=geeSliderCaptcha.js.map