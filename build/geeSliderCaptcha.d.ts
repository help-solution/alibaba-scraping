import { Page } from 'puppeteer';
declare const skipCaptcha: (page: Page) => Promise<void>;
export default skipCaptcha;
