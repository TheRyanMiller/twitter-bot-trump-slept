const download = require('image-downloader');
const moment = require('moment');
const Twitter = require('twitter');
const path = require('path');
const fs = require('fs');
const database = require('./dbSchemas');
const tweetCollector = require('./tweetCollector');
const tweetPoster = require('./tweetPoster');
require('dotenv').config();

tweetCollector();
// let today = moment().format('YYYY-MM-DD');
// let earlyMorningEnd = moment(today + " " + process.env.MORNING_END_TIME).format().valueOf();
// waketime = moment(earlyMorningEnd).format('YYYY-MM-DD HH:mm:ss');
// let bedtime=moment("2020-06-16 23:27:56","YYYY-MM-DD HH:mm:ss");
// console.log(moment(bedtime).format('YYYY-MM-DD HH:mm:ss'))
// console.log()

// console.log(moment(earlyMorningEnd).format('YYYY-MM-DD HH:mm:ss'))
// console.log(waketime)
// console.log()


// let sleepSeconds = moment(earlyMorningEnd).diff(moment(bedtime),'seconds')
// const totalSleep = moment.utc(sleepSeconds*1000).format('HH:mm:ss');
// console.log(totalSleep)