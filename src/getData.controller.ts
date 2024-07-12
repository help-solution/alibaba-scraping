import { Page } from "puppeteer";
import delay from "./utils";

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

const getData = async (page: Page) => {
  const productInfoSelector = "._2ZET87n8";
  await page.waitForSelector(productInfoSelector);
  const card_data_el = await page.$(productInfoSelector);

  const id = await page.evaluate(
    () =>
      document.head
        .querySelector('meta[property="fb:app_id"]')
        ?.getAttribute("content") || ""
  );

  const title = await page.evaluate(
    () =>
      document.head
        .querySelector('meta[name="title"]')
        ?.getAttribute("content") || ""
  );

  const body_html = await page.evaluate(
    () =>
      document.head
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content") || ""
  );

  const vendor = await card_data_el?.evaluate(
    (el: any) =>
      el.querySelector("#rightContent > div.HFooICRX._3p1wuyo2").innerText
  );

  const tags = await card_data_el?.evaluate(
    (el: any) => el.querySelector("._2rn4tqXP").innerText
  );

  const getImageMetadata = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const lastModified = response.headers.get("last-modified");
    const createDate = response.headers.get("Date");

    return {
      create_at: createDate,
      lastupdate_at: lastModified,
    };
  };

  const image_selector = "._2ftcdy74";
  await page.waitForSelector(image_selector);
  const image_els = await page.$$(image_selector);
  if (image_els.length > 0) {
    for (let img of image_els) {
      while (true) {
        try {
          await img.waitForSelector(
            "img[src^='https'], img[data-src^='https']"
          );
          break;
        } catch { }
        await delay(300);
      }
    }
  }
  const images = await Promise.all(
    image_els.map(async (el: any, index: number) => {
      const data = await el.evaluate((item: any) => {
        const imgElement = item.querySelector("img");
        return {
          alt: imgElement.getAttribute("alt") || "",
          src:
            imgElement.getAttribute("src") ||
            imgElement.getAttribute("data-src"),
          width: imgElement.naturalWidth,
          height: imgElement.naturalHeight,
        };
      });
      const { create_at, lastupdate_at } = await getImageMetadata(data.src);
      return {
        id: "",
        position: index.toString() || "",
        ...data,
        create_at,
        lastupdate_at,
      };
    })
  );

  let product;
  const option_selector = "._3csHYvw1";
  const option_element = await page.$(option_selector);
  if (option_element !== null) {
    product = await option_element.evaluate((el: any) => {
      const variantPriceElement = document.querySelector("._3cZnvUvE");
      const variantPrice: string =
        variantPriceElement !== null
          ? variantPriceElement.getAttribute("aria-label") || ""
          : "";
      const priceMatch = variantPrice.match(/\d+(\.\d+)?/g);
      const price = priceMatch ? priceMatch[0] : "";
      const title =
        document.querySelector("._2zqZP145 > span > em")?.innerHTML || "";
      const currency =
        document.querySelector("._3cZnvUvE > span:last-child")?.innerHTML || "";
      return {
        title,
        price,
        currency,
      };
    });
  }

  const elements_array = "._3mjWr5DX";
  let variants: any;
  if (await page.waitForSelector(elements_array, { timeout: 1000 })
    .then(async () => { await delay(1000); return 1; }).catch(() => 0)) {
    const element = await page.$(elements_array);
    variants = await element?.evaluate((el: any) => {
      let variants: any = [];
      let id =
        document.head
          .querySelector('meta[property="fb:app_id"]')
          ?.getAttribute("content") || "";

      const elementArray = el.querySelectorAll("._2bzGqXzH");
      for (let i = 0; i < elementArray.length; ++i) {
        elementArray[i].click();
        const variantPriceElement = document.querySelector("._3cZnvUvE");
        const variantPrice: string =
          variantPriceElement !== null
            ? variantPriceElement.getAttribute("aria-label") || ""
            : "";
        const priceMatch = variantPrice.match(/\d+(\.\d+)?/g);
        const price = priceMatch ? priceMatch[0] : ""; // If there is a match, assign the first element to 'price', otherwise assign an empty string
        const option1 = document.querySelector(
          "._2aXpqYRk > div > em"
        )?.innerHTML;
        const option2 = document.querySelector(".p9maYisg")?.innerHTML;
        const image_url = elementArray[i]
          .querySelector(".wxWpAMbp")
          .getAttribute("src");

        variants.push({
          id: id || "",
          title: option1 || "",
          price: price,
          option1: option1 || "",
          option2: option2 || "",
          option3: "",
          image_url: image_url || "",
        });
      }
      return variants;
    });
  }

  const option1_selector = "._3mjWr5DX";
  let option1;
  if (await page.waitForSelector(option1_selector, { timeout: 1000 })
    .then(async () => { await delay(1000); return 1; }).catch(() => 0)) {
    const option1_element = await page.$(option_selector);
    option1 = {
      id: "",
      product_id: id,
      position: "1",
      ...(await option1_element?.evaluate((el: any) => ({
        name:
          document
            .querySelector("._1yW2vOYd > div > div")
            ?.getAttribute("aria-label") || "",
        values: Array.from(document.querySelectorAll("._2bzGqXzH")).map(
          (variant: any) => variant.getAttribute("aria-label")
        ),
      }))),
    };
  }

  const option2_selector = "._4kzxjBkE";
  let option2;
  if (await page.waitForSelector(option2_selector, { timeout: 1000 })
    .then(async () => { await delay(1000); return 1; }).catch(() => 0)) {
    const option2_element = await page.$(option2_selector);

    option2 = {
      id: "",
      product_id: id,
      position: "2",
      ...await option2_element?.evaluate((el: any) => ({
        name: document.querySelector(".aZN7lGU3")?.getAttribute("aria-label") || "",
        values: Array.from(document.querySelectorAll("._2MDh6s4q")).map(
          (variant: any) => variant.getAttribute("aria-label"))
      }))
    };
  }

  const ProductData: IProductData = {
    id,
    title,
    body_html,
    vendor,
    tags,
    currency: product?.currency,
    images,
    product,
    variants,
    options: [option1, option2],
  };

  return ProductData;
};

export { getData };
