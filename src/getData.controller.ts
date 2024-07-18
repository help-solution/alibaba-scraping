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

const getData = async (page: Page) => {
  const header: Partial<IProductData> = await page.evaluate(() => {    
    const title = document.querySelector('title')?.textContent || ""; 
    const description = document.querySelector('div.module_title > div > h1')?.innerHTML || "";
    return {      
      title,
      description    
    };
  });

  const product = async () => {
    await page.waitForSelector('#container > div.root > div.layout-body > div.layout-right > div > div > div > div.module_sku > div > div.sku-info > div:nth-child(2) > a:nth-child(1)', { timeout: 10000 });
    const module_dialog_element = await page.$('#container > div.root > div.layout-body > div.layout-right > div > div > div > div.module_sku > div > div.sku-info > div:nth-child(2) > a:nth-child(1)');
    await module_dialog_element?.click();

    await page.waitForSelector('.sku-dialog-content');
    const sku_module_element = await page.$('.sku-dialog-content');

    const priceData = await sku_module_element?.evaluate((el: Element) => {      

      const price = el.querySelector('.product-price .price-list .price-item .price span')?.textContent?.trim() || "";

      return price;
    });

    const options = await sku_module_element?.evaluate((el: Element) => {
      const option1_elements = document.querySelectorAll('div.sku-info > div:nth-child(2) > a.image');
      const option1 = Array.from(option1_elements).map((option: any) => {
        option.click();
        const name = el.querySelector('div.sku-info > h4:nth-child(1) > span')?.innerHTML || "";
        const img = option.querySelector('img')?.getAttribute('src') || "";
        return { name, img };
      });
      const option1_name = el.querySelector('div.sku-info > h4:nth-child(1)')?.textContent?.trim() || "";

      const option2_elements = document.querySelectorAll('div.sku-info > div:nth-child(4) > a');

      const option2 = Array.from(option2_elements).map((option: any) => {
        return option.querySelector('span').textContent?.trim() || null
      });
      const option2_name = el.querySelector('div.sku-info > h4:nth-child(3)')?.textContent?.trim() || "";

      const option3_elements = document.querySelectorAll('div.sku-info > div:nth-child(6) > a');
      const option3 = Array.from(option3_elements).map((option: Element) => {
        const type = option.querySelector('span')?.textContent?.trim() || "";        
        return type;
      });
      const option3_name = el.querySelector('div.sku-info > h4:nth-child(5)')?.textContent?.trim() || "";

      return {
        option1: { name: option1_name, value: option1 },
        option2: { name: option2_name, value: option2 },
        option3: { name: option3_name, value: option3 }
      };
    });

    const variants = options?.option1.value.map((op1, op1_index) =>
      options.option2?.value?.map((op2, op2_index) => {
        return {
          title: `${op1.name} / ${op2}`,
          sku: `SKU-${(op1_index + 1) * (op2_index + 1)}`,
          price: priceData,
          compare_at_price: priceData,
          option1: op1.name,
          option2: op2,
          option3: options.option3,
          imgUrl: op1.img
        }
      })
    )

    console.log(variants);

    const vendorSelectors = ['.strong', '.logistic-item']
    const vendor = await getVendor(page, vendorSelectors);
    return { variants, priceData, options, vendor };
  };

  await page.waitForSelector('.image-list-item', { visible: true });
  const images = await page.evaluate(() => {
    const images = document.querySelectorAll('.image-list-item');
    return Array.from(images).map(img => img.getAttribute('src') || "");
  });

  const productResult = await product();  

  const ProductData: IProductData = {
    title: header.title,
    vendor: productResult.vendor || undefined,
    description: header.description,
    price: productResult.priceData,
    options: [productResult.options?.option1, productResult.options?.option2, productResult.options?.option3],
    variants: productResult.variants,
    images,
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
