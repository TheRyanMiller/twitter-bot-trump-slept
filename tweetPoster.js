require('dotenv').config()
const Twitter = require('twitter');
const Tweet = require('./tweetSchema');
const moment = require('moment');

module.exports = () => {
    let client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    morningStartTime = "04:00";
    morningEndTime = "08:00";
    nightStartTime = "22:30";

    let today = moment().format('YYYY-MM-DD');
    let yesterday = moment().subtract(1, "days").format('YYYY-MM-DD');

    let lateNightBegin = moment(yesterday + " " + nightStartTime).format().valueOf();
    let lateNightEnd = moment(today + " " + morningStartTime).format().valueOf();

    let earlyMorningBegin = moment(today + " " + morningStartTime).format().valueOf();
    let earlyMorningEnd = moment(today + " " + morningEndTime).format().valueOf();

    let bedtime;
    let waketime;

    /*Query late night*/
    const promise1 = new Promise((resolve, reject) => {
        Tweet.model
        .findOne({"created_at": { $gt : lateNightBegin, $lt : lateNightEnd } })
        .sort({"created_at": 1})
        .then(t => {
            if(!t) bedtime = moment(lateNightBegin).format('YYYY-MM-DD HH:mm:ss');
            else{
                bedtime = moment(t.created_at).format('YYYY-MM-DD HH:mm:ss');
            }
            resolve();
        })
    })

    /*Query early morning*/
    const promise2 = new Promise((resolve, reject) => {
        Tweet.model
            .findOne({"created_at": { $gt : earlyMorningBegin, $lt : earlyMorningEnd } })
            .sort({"created_at": 1})
            .then(t => {
                if(!t) waketime = moment(earlyMorningEnd).format('YYYY-MM-DD HH:mm:ss');
                else{
                    waketime = moment(t.created_at).format('YYYY-MM-DD HH:mm:ss');
                }
                resolve();
            })
    })

    Promise.all([promise1, promise2]).then(values => {
        console.log("BEDTIME: ",bedtime);
        console.log("WAKETIME: ",waketime);
        let sleepSeconds = moment(waketime).diff(moment(bedtime),'seconds')
        const totalSleep = moment.utc(sleepSeconds*1000).format('HH:mm:ss');
        console.log(totalSleep);
        ptotals = totalSleep.split(":");
        let message = "Good morning!\nI slept a total of "+Number(ptotals[0])+" hours, "+Number(ptotals[1])+" minutes, and "+Number(ptotals[2])+" seconds last night!";
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
            //console.log(tweet);  // Tweet body.
            //console.log(response);  // Raw response object.
        });  
    })
}