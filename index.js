const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const admin = require('firebase-admin');
const _ = require('lodash');
const serviceAccount = require('./nofn-4cfa4-firebase-adminsdk-rtj3v-fa340427ed.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://nofn-4cfa4.firebaseio.com'
});

const nameCollection = [];
axios
  .get('http://attavitinn.is/sambond-og-kynlif/fjolskylda/merkingar-nafna/')
  .then(response => {
    groupData(response.data);
  })
  .catch(error => {
    console.log(error);
  });

function groupData(html) {
  const $ = cheerio.load(html);
  $('li.men').each(function (i, element) {
    const nameDefArr = $(this)
      .text()
      .split(/[\r\n]+/);
    const removeEmpty = nameDefArr.filter(name => name !== '');

    if (typeof removeEmpty[1] !== 'undefined') {
      nameCollection.push({ name: removeEmpty[0], desc: removeEmpty[1] });
    }
  });
  const groupedNames = _.groupBy(nameCollection, item => item.name.charAt(0));
  const alphabet = Object.keys(groupedNames);
  // console.log(groupedNames);
  alphabet.forEach(letter => {
    writeToDb(letter, groupedNames[letter]);
  });
}

function writeToDb(doc, data) {
  const db = admin.firestore();
  const setDoc = db
    .collection('maleNames')
    .doc(doc)
    .set({ names: data });
}
