import puppeteer from "puppeteer-extra";
import { getData } from "./getData.controller";

const scrapAlibabaProduct = async (url: string): Promise<any | Error> => {
    try {
        console.log("Scraping data...");

        const browser = await puppeteer.launch({
            headless: false
        })

        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
        // Get product data
        const productResult: any = await getData(page);
        console.log(productResult);
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

export {scrapAlibabaProduct};
