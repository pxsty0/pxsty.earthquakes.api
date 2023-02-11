const fetch = require("node-fetch");
const cheerio = require("cheerio");
const express = require("express");
const app = express();

app.get("/", (apiReq, apiRes) => {
  fetch("https://deprem.afad.gov.tr/last-earthquakes.html")
    .then((res) => res.text())
    .then((res) => {
      const $ = cheerio.load(res);
      let arr = [];
      $("tbody>tr").each((i, el) => {
        let json = { tr: {}, en: {} };
        cheerio
          .load(el)("td")
          .each((x, y, i) => {
            const html = $(y).html();
            switch (x) {
              case 0:
                json.tr.tarih = html;
                json.en.date = html;
                break;
              case 1:
                json.tr.enlem = html;
                json.en.latitude = html;
                break;
              case 2:
                json.tr.boylam = html;
                json.en.longitude = html;
                break;
              case 3:
                json.tr.derinlik = html;
                json.en.depth = html;
                break;
              case 4:
                json.tr.tip = html;
                json.en.type = html;
                break;
              case 5:
                json.tr.buyukluk = html;
                json.en.size = html;
                break;
              case 6:
                json.tr.yer = html;
                json.en.place = html;
                break;
              case 7:
                json.afadDepremID = html;
                break;
            }
          });
        arr.push(json);
      });
      apiRes.json({
        status: 200,
        by: "github.com/pxsty0",
        data: arr,
      });
    });
});

app.listen(80, () => console.log("api aktif"));
