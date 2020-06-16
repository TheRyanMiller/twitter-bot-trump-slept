// const tweetCollector = require('./tweetCollector');
// const tweetPoster = require('./tweetPoster');
const cron = require('node-cron');

let collectorTask = cron.schedule("*/5 * * * *", () => {
    console.log("Collecting!");
})

let postTask = cron.schedule("0 10 * * *", () => {
    console.log("Posting!");
})