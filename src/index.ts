import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { getData } from "./getData.controller";
import delay from "./utils";

const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_2a5e82db-zone-web_unlocker1:m47tpduqy4ji@brd.superproxy.io:22225';

puppeteer.use(StealthPlugin());

interface ProductResult {
    // Define the structure of the product result
    // e.g., name: string; price: string; etc.
}

const scrapTemuProduct = async (url: string): Promise<ProductResult | Error> => {
    try {
        console.log("Scraping data...");

        // const browser = await puppeteer.launch({
        //     headless: false
        // })
        const browser = await puppeteer.connect({
            browserWSEndpoint: SBR_WS_ENDPOINT
        });

        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

        // Wait and click the accept all button if it exists
        await page.waitForSelector("._3E4sGl93", { timeout: 10000 }).catch(() => console.log("Accept button not found"));
        const acceptAll = await page.$("._3E4sGl93");
        if (acceptAll) {
            await acceptAll.evaluate((accept: Element) => (accept as HTMLElement).click());
        }

        // Delay for a second to ensure the click action is processed
        await delay(1000);

        // Get product data
        const productResult: ProductResult = await getData(page);

        await browser.close();
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

export { scrapTemuProduct };
