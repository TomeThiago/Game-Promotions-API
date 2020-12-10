const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://store.playstation.com/pt-br/category/35027334-375e-423b-b500-0d4d85eff784/1');
  
  const results = await page.evaluate(() => {
      //get the list of offers from the website
      const nodeList = document.querySelectorAll('.ems-sdk-product-tile__details');
      //transform NodeList to array
      const offers = [...nodeList];

      const listOffers = offers.map(offer => {
      
        const [offerPrice, price] = offer.children[2].innerText.split('\n');

        return {
          title: offer.children[0].innerText,
          offer: offerPrice,
          price: price,
          discount: offer.children[1].innerText,
          photo: offer.previousSibling.querySelector('img').src.replace('?w=54&thumb=true', ""),
          page: offer.parentNode.href
        }
      });
      //transform the offers in object javascript
      //returns to the client
      return listOffers;
  });

  browser.close();
  return res.json(results);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});