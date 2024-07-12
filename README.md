# Scraping Temu E-commerce Website

## Description

Backend module to scrap Temu E-commerce website using TypeScript, Node.js and Puppeteer

## Installation

```
$ npm install temu-scraper
```

## How to use

```
This module use chrome default browser to skip authentication by everytime.

import {scrapTemuProduct} from "temu-scraper";

  const scrapController = async (req: Request, res: Response) => {
    const result = await scrapTemuProduct(req.body.url);
    result ? 
      res.status(200).json(result) :
      res.status(500).json({"error": "Didn't get data because net error or net speed!!"});
  }

  export default scrapController;
```

