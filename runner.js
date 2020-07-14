const tweetCollector = require('./tweetCollector');
const tweetPoster = require('./tweetPoster');
const tweetChartToTimeline = require('./tweetChartToTimeline');
const followersCollector = require('./followerCollector');
const replyToTargettedUsers = require('./replyToTargettedUsers');
const cron = require('node-cron');
require('dotenv').config()

const intervalInMins = process.env.COLLECTOR_INTERVAL_MINS;
const postTime = process.env.DAILY_POST_TIME_HOURS_AFTER_MIDNIGHT;

console.log("Starting bot...");

let collectorTask = cron.schedule("*/"+intervalInMins+" * * * *", () => {
    tweetCollector();
});

let postTask = cron.schedule("0 "+postTime+" * * *", () => {
    tweetPoster();
    console.log("Posting daily sleep.");
});

let postSleepChart = cron.schedule("1 "+postTime+" * * 6", () => {
    tweetChartToTimeline();
    console.log("Posting sleep chart.");
});

let dailyFollowerCollector = cron.schedule("1 0 * * *", () => {
    followersCollector();
    console.log("Today's followers collected.");
});

let replier = cron.schedule("* * * * *", () => {
    console.log("Checking tweets from target users...");
    replyToTargettedUsers();
});