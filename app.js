const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Your SEO data at one click!");
});

app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Put your URL..." });
  }
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const metaTitle = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content");
    const keywords = $('meta[name="keywords"]').attr("content");

    const headings = {};
    $("h1,h2,h3,h4,h5,h6").each((index, element) => {
      const tagName = $(element).get(0).tagName;
      if (!headings[tagName]) {
        headings[tagName] = [];
      }
      headings[tagName].push($(element).text().trim());
    });
    res.json({
      metaTitle,
      metaDescription,
      keywords,
      headings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while getting the data." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
