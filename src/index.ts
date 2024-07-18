import puppeteer from "puppeteer-extra";
import { getData } from "./getData.controller";

const scrapAlibabaProduct = async (url: string): Promise<any | Error> => {
    try {
        console.log("Scraping data...");

        const browser = await puppeteer.launch({
            headless: false
        })

        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "domcontentloaded" });
        // Get product data
        const productResult: any = await getData(page);
        return productResult;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
            return error;
        } else {
            console.error("Unexpected error:", error);
            return new Error("Unexpected error occurred");
        }
    }
};

// scrapAlibabaProduct('https://www.alibaba.com/product-detail/free-sample-100-cotton-white-black_1600983321428.html?cardType=101002745&cardId=10001351942')
// scrapAlibabaProduct('https://www.alibaba.com/product-detail/OEM-ODM-2020-Minimalist-Men-s_1600359184025.html')
// scrapAlibabaProduct('https://www.alibaba.com/product-detail/OEM-Custom-Split-Hem-Wholesale-Baggy_1601088614185.html?cardType=101002745&cardId=10001265375')
export {scrapAlibabaProduct};
