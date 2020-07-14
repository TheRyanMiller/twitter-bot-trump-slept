require('dotenv').config()
const Twitter = require('twitter');
const database = require('./dbSchemas');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const buildChart = require('./buildSleepChart');

module.exports = () => {
    let client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    let targettedUsers = process.env.TARGETTED_TWITTER_USERS.split(",")
    let replyTweetId = "";
    let status = "";

    targettedUsers.forEach(u=>{
        client.get('statuses/user_timeline', {
            screen_name: u,
            count: 1,
            exclude_replies: false,
            include_rts: 0
        },  
            function(error, tweet, response) {
                if(error) console.log(error);
                
                //Check if created in last 2 minutes
                const twoMinutesAgo = moment().subtract(1, 'minutes');
                if(moment(tweet[0].created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').isAfter(twoMinutesAgo)){
                    replyTweetId = tweet[0].id_str;
                    console.log("Replying to: ","@"+u);
                    replyToTweet(u);
                }
            }
        );
    });

    const replyToTweet = (u) => {
        let today = moment().format('MM-DD-YYYY');
        buildChart(today).then( result => {
            uploadAndTweet();
        });

        const uploadAndTweet = () => {
            let image_path = path.join(__dirname, '/charts/'+today+'.jpg');
            let b64content = fs.readFileSync(image_path, { encoding: 'base64' });
        
            console.log('Uploading an image...');

            //Get latest sleep duration
            database.sleepLog.find({}).sort({createdAt: -1}).limit(1).then( log => {
                if(log[0].sleepDuration){
                    ptotals = log[0].sleepDuration.split(":");
                    status = "@"+u+"Donald Trump, slept for "+ptotals[0]+" hours, "+ptotals[1]+" minutes, "+ptotals[2]+" seconds last night.";
                    status = status+"\nFollow me for more Trump sleep stats!";
                    client.post('media/upload', { media_data: b64content }, function (err, data, response) {
                        if (err){
                          console.log('ERROR:');
                          console.log(err);
                        }
                        else{
                          console.log('Image uploaded!');
                          client.post('statuses/update', {
                              status,
                              media_ids: data.media_id_string,
                              in_reply_to_status_id: ""+replyTweetId,
                          },
                            function(err, data, response) {
                              if (err){
                                console.log('ERROR:');
                                console.log(err);
                              }
                              else{
                                console.log('Image tweeted!');
                              }
                            }
                          );
                        }
                    });
                }
            })
            
        };
    }
}