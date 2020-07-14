require('dotenv').config()
const Twitter = require('twitter');
const database = require('../dbSchemas');
const moment = require('moment');

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
            const twoMinutesAgo = moment().subtract(85, 'minutes');
            if(moment(tweet[0].created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').isAfter(twoMinutesAgo)){
                let dateVal = moment(tweet[0].created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en')
                replyTweetId = tweet[0].id_str;
                console.log("Last tweet date: ",moment(dateVal).format("MM-DD-YYYY HH:mm:ss ZZ"))
                console.log("Last tweet user: ","@"+u);
                console.log(" --------- ");
            }
        }
    );
});
