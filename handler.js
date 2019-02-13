'use strict';
const uuid = require('uuid');
const cheerio = require('cheerio');
const wretch = require('wretch');
const dynamodb = require('./dynamodb');

wretch().polyfills({
    fetch: require('node-fetch'),
    FormData: require('form-data'),
    URLSearchParams: require('url').URLSearchParams
})

module.exports['gov-deals'] = async (event, context) => {
  const query = 'cars' // TODO switch to 'scooter' after testing
  const html = await wretch('https://www.govdeals.com/index.cfm')
    .query({
      fa: `Main.AdvSearchResultsNew`,
      searchPg: `Main`,
      kWord: query,
    })
    .get()
    .text()
  const $ = cheerio.load(html)
  const results = $(`.searchResults tr`).map((i, el) => ({
    thumbnail: cheerio(el).find('td:nth-child(1) img').attr('src'),
    title: cheerio(el).find('td:nth-child(1) a').text().trim(),
  })).get()

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      text: results,
    },
   
  };

  dynamodb.put(params, (error) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      });
    };
    return
  })

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event }
}
