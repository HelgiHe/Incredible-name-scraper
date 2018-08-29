const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');
const names = require('./nameData');
const URls = require('./urls');

// for (let name of names) {
//   console.log(name.Nafn);
// }

request(
  'https://attavitinn.is/sambond-og-kynlif/fjolskylda/merkingar-nafna/',
  function(error, response, html) {
    if (error) {
      console.log(error);
    }
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $('li.woman').each(function(i, element) {
        var a = $(this).html();
        console.log(
          $(this)
            .text()
            .split(/[\r\n]+/),
        );
        // console.log($(this).html());
      });
    }
  },
);
