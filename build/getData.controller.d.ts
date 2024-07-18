import { Page } from "puppeteer";
interface IProductData {
    id?: string;
    title?: string;
    description?: any;
    images?: string[];
    vendor?: string;
    price?: any;
    options?: any;
    product?: {
        name: string;
        img: string;
        create_at: string;
        lastupdate_at: string;
    }[];
    variants: any;
}
declare const getData: (page: Page) => Promise<IProductData>;
export { getData };
