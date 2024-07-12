import { Page } from "puppeteer";
interface IProductData {
    id?: string | "";
    title?: string | "";
    body_html?: string | "";
    images?: object | [];
    toPrice?: string;
    fromPrice?: string;
    vendor?: string;
    tags?: string;
    currency?: string;
    options?: any[];
    product?: any;
    variants?: any[];
}
declare const getData: (page: Page) => Promise<IProductData>;
export { getData };
