import { Page } from "puppeteer";
interface IProductData {
    id?: string;
    title?: string;
    body_html?: string;
    images?: string[];
    vendor?: string;
    price?: {
        quality: string;
        price: string;
    }[];
    options?: {
        option2?: string | null;
        option3?: {
            type: string;
            price: string;
        }[];
    };
    product?: {
        name: string;
        img: string;
        create_at: string;
        lastupdate_at: string;
    }[];
}
declare const getData: (page: Page) => Promise<IProductData>;
export { getData };
