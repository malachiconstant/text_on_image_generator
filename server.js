const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');


const port = 8080;
const mainHTTP = `http://localhost:${port}` // Choose any available port


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')))

app.get('/', (req, res) => {
  res.render('index.ejs')
})

// puppeteer opens the page where the image and text are, then takes a screenshot and stores image.  this page then redirects to the generated image file
app.get('/puppeteer/*', (req, res) => {
  
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const assignNum = Math.floor(Math.random() * 10000);
    await page.goto(`${mainHTTP}/personalize_image?${req.params[0]}`, {
      waitUntil: 'domcontentloaded',
    });

    const fileElement = await page.waitForSelector('#image_container')
    await fileElement.screenshot({
      path: `views/images/personalized_images/new/personalized_image_${assignNum}.png`,
    });

    res.redirect(302, `${mainHTTP}/images/personalized_images/new/personalized_image_${assignNum}.png`);
    // res.render('hn.png')
    await browser.close();
  })();
})

// page where pupeteer takes the screenshot from
app.get('/personalize_image', (req, res) => {
  res.render('personalize_image.ejs')
})

app.get('/image_in_html', (req, res) => {
  res.render('image_in_html.ejs')
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  //console.log(process.platform);
});