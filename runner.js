const tweetCollector = require('./tweetCollector');
const tweetPoster = require('./tweetPoster');
const cron = require('node-cron');

let collectorTask = cron.schedule("* * * * *", () => {
    tweetCollector();
    require('./tweetCollector');
})

let postTask = cron.schedule("0 9 * * *", () => {
    tweetPoster();
    console.log("Posting!");
})