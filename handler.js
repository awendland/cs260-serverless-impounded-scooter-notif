'use strict';
const cheerio = require('cheerio')
const wretch = require('wretch')
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
    // title: cheerio(el).find('td:nth-child(1) a').text().trim(),
  })).get()
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
      results,
    }),
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event }
}
