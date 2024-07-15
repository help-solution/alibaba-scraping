import { Page } from "puppeteer";
import delay from "./utils";

interface IProductData {
  id?: string;
  title?: string;
  body_html?: string;
  images?: string[];
  vendor?: string;
  price?: { quality: string; price: string }[];
  options?: {
    option2?: string | null;
    option3?: { type: string; price: string }[];
  };
  product?: {
    name: string;
    img: string;
    create_at: string;
    lastupdate_at: string;
  }[];
}

const getData = async (page: Page) => {
  const header: Partial<IProductData> = await page.evaluate(() => {
    const id = document.querySelector('head > meta:nth-child(6)')?.getAttribute('content') || "";
    const title = document.querySelector('title')?.textContent || "";
    const body_html = document.querySelector('meta[http-equiv="origin-trial"]')?.getAttribute("content") || "";
    return {
      id,
      title,
      body_html,
    };
  });

  const product = async () => {
    await page.waitForSelector('#container > div.root > div.layout-body > div.layout-right > div > div > div > div.module_sku > div > div.sku-info > div:nth-child(2) > a:nth-child(1)', { timeout: 10000 });
    const module_dialog_element = await page.$('#container > div.root > div.layout-body > div.layout-right > div > div > div > div.module_sku > div > div.sku-info > div:nth-child(2) > a:nth-child(1)');
    await module_dialog_element?.click();

    await page.waitForSelector('.sku-dialog-content');
    const sku_module_element = await page.$('.sku-dialog-content');

    const priceData = await sku_module_element?.evaluate((el: Element) => {
      interface PriceItem {
        quality: string;
        price: string;
      }
      const priceItems: PriceItem[] = [];

      const elements = el.querySelectorAll('.product-price .price-list .price-item');

      elements.forEach((element: Element) => {
        const qualityElement = element.querySelector('.quality')?.textContent?.trim() || "";
        const priceElement = element.querySelector('.price span')?.textContent?.trim() || "";

        priceItems.push({ quality: qualityElement, price: priceElement });
      });

      return priceItems;
    });

    const options = await sku_module_element?.evaluate((el: Element) => {
      const option1_elements = el.querySelectorAll('div.sku-layout.logistics > div.sku-info > div:nth-child(2) > a.image');
      const option1 = Array.from(option1_elements).map((option: any) => {
        option.click();
        const name = el.querySelector('div.sku-layout.logistics > div.sku-info > h4:nth-child(1) > span')?.innerHTML || "";
        const img = option.querySelector('img')?.getAttribute('src') || "";
        return { name, img };
      });

      const option2Element = el.querySelector('div.sku-layout.logistics > div.sku-info > div:nth-child(4) > a > span');
      const option2 = option2Element ? option2Element.innerHTML : null;

      const option3_elements = el.querySelectorAll('.last-sku-item');
      const option3 = Array.from(option3_elements).map((option: Element) => {
        const type = option.querySelector('span.last-sku-first-item > span > span')?.innerHTML || "";
        const price = option.querySelector('span.price')?.innerHTML || "";
        return { type, price };
      });

      return { option1, option2, option3 };
    });
    
    const vendorSelectors = ['.strong', '.logistic-item']
    const vendor = await getVendor(page, vendorSelectors);
    return { priceData, options, vendor };
  };

  await page.waitForSelector('.image-list-item', { visible: true });
  const images = await page.evaluate(() => {
    const images = document.querySelectorAll('.image-list-item');
    return Array.from(images).map(img => img.getAttribute('src') || "");
  });

  const productResult = await product();

  const getImageMetadata = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const lastModified = response.headers.get("last-modified");
    const createDate = response.headers.get("Date");

    return {
      create_at: createDate || "",
      lastupdate_at: lastModified || "",
    };
  };

  const productMetaInfo = await Promise.all((productResult.options?.option1 ?? []).map(async (option) => {
    const metaData = await getImageMetadata(option.img);
    return {
      name: option.name,
      img: option.img,
      create_at: metaData.create_at,
      lastupdate_at: metaData.lastupdate_at,
    };
  }));

  const ProductData: IProductData = {
    id: header.id,
    title: header.title,
    body_html: header.body_html,
    vendor: productResult.vendor || undefined,
    images,
    price: productResult.priceData,
    product: productMetaInfo,
    options: {
      option2: productResult.options?.option2 || null,
      option3: productResult.options?.option3,
    },
  };

  return ProductData;
};

const getVendor = async (page: Page, selectors: string[]) => {
  for (const selector of selectors) {
    try {
      await page.waitForSelector(selector, { visible: true, timeout: 1000 });
      const vendorElement = await page.$(selector);
      if (vendorElement) {
        const vendorText = await vendorElement.evaluate((el: Element) => el.textContent?.trim() || "");
        if (vendorText) {
          return vendorText;
          
        }
      }
    } catch (error) {
      console.error(`Error finding vendor element with selector ${selector}: ${error}`);
    }
  }
  return null;
};


export { getData };
