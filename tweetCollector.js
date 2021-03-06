require('dotenv').config()
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

    let tempTweet;

    client.get('statuses/user_timeline', { 
        // user_id: '',
        screen_name: process.env.TWITTER_USER_TO_TRACKS_SCREEN_NAME,
        count: process.env.COLLECTOR_TWEET_COUNT,
        exclude_replies: false,
        include_rts: 1
    },  
        function(error, tweet, response) {
            if(error) console.log(error);
            //throw error
            tweet.forEach(t => {
                try{
                    tempTweet = new database.tweet({
                        id: t.id_str, 
                        status: t.text, 
                        author: t.user.id, 
                        created_at: moment(t.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').valueOf() 
                    })
                    tempTweet.save( err => { if(err) return } )
                }
                catch(err){
                    console.log("Caught ERROR: ",err)
                }
            });
        }
    );
}