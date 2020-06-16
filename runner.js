const tweetCollector = require('./tweetCollector');
const tweetPoster = require('./tweetPoster');
const cron = require('node-cron');
require('dotenv').config()

const intervalInMins = process.env.COLLECTOR_INTERVAL_MINS;
const postTime = process.env.DAILY_POST_TIME_HOURS_AFTER_MIDNIGHT;

console.log("Starting bot...");

let collectorTask = cron.schedule("*/"+intervalInMins+" * * * *", () => {
    tweetCollector();
    require('./tweetCollector');
});

let postTask = cron.schedule("0 "+postTime+" * * *", () => {
    tweetPoster();
    console.log("Posting!");
});