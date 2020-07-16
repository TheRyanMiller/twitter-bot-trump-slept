require('dotenv').config();
const Twitter = require('twitter');
const database = require('./dbSchemas');
const moment = require('moment');

module.exports = () => {
    let client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    let today = moment().format('YYYY-MM-DD');
    let yesterday = moment().subtract(1, "days").format('YYYY-MM-DD');

    let lateNightBegin = moment(yesterday + " " + process.env.NIGHT_START_TIME).format().valueOf();
    let lateNightEnd = moment(today + " " + process.env.MORNING_START_TIME).format().valueOf();

    let earlyMorningBegin = moment(today + " " + process.env.MORNING_START_TIME).format().valueOf();
    let earlyMorningEnd = moment(today + " " + process.env.MORNING_END_TIME).format().valueOf();

    let bedtime;
    let waketime;
    let sleepLog;

    /*Query late night*/
    const queryNightTweet = new Promise((resolve, reject) => {
        database.tweet
        .findOne({"created_at": { $gt : lateNightBegin, $lt : lateNightEnd } })
        .sort({"created_at": -1})
        .then(t => {
            if(!t) bedtime = moment(lateNightBegin).format('YYYY-MM-DD HH:mm:ss');
            else{
                bedtime = moment(t.created_at).format('YYYY-MM-DD HH:mm:ss');
            }
            resolve();
        })
    })

    /*Query early morning*/
    const queryMorningTweet = new Promise((resolve, reject) => {
        database.tweet
            .findOne({"created_at": { $gt : earlyMorningBegin, $lt : earlyMorningEnd } })
            .sort({"created_at": 1})
            .then(t => {
                if(!t){
                    waketime = moment(earlyMorningEnd).format('YYYY-MM-DD HH:mm:ss');
                }
                else{
                    waketime = moment(t.created_at).format('YYYY-MM-DD HH:mm:ss');
                }
                resolve();
            })
    })

    Promise.all([queryNightTweet, queryMorningTweet]).then(values => {
        let sleepSeconds = moment(waketime).diff(moment(bedtime),'seconds');
        const totalSleep = moment.utc(sleepSeconds*1000).format('HH:mm:ss');
        ptotals = totalSleep.split(":");
        sleepLog = new database.sleepLog({
            date: moment().format("MM-DD-YYYY"),
            sleepDuration: totalSleep
        })
        sleepLog.save( err => {
            if(err) console.log(err);
        })

        let message = "Good morning! 🌞\nI slept a total of "+Number(ptotals[0])+" hours, "+Number(ptotals[1])+" minutes, and "+Number(ptotals[2])+" seconds last night.";
        client.post('statuses/update', {
            status: message
        },  function(error, tweet, response) {
            if(error) {
                console.log(error);
                console.log("ERROR!!!")  
                return;
            }
            else{
                console.log("Tweet Posted Successfully!")
            }
        });  
    })
}