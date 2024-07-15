interface ProductResult {
}
declare const scrapAlibabaProduct: (url: string) => Promise<ProductResult | Error>;
export { scrapAlibabaProduct };
