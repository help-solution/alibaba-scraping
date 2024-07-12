interface ProductResult {
}
declare const scrapTemuProduct: (url: string) => Promise<ProductResult | Error>;
export { scrapTemuProduct };
