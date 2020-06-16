require('dotenv').config()
const Twitter = require('twitter');
const Tweet = require('./tweetSchema');
const moment = require('moment');


let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

let tempTweet;

const collect = () => {
    client.get('statuses/user_timeline', { 
        // user_id: '',
        screen_name: 'realDonaldTrump',
        count: 50,
        exclude_replies:false,
        include_rts: true
    },  
        function(error, tweet, response) {
            if(error) console.log(error);
            //throw error
            console.log("Number of tweets found: ",tweet.length)
            tweet.forEach(t => {
                try{
                    tempTweet = new Tweet.model({
                        id: t.id_str, 
                        status: t.text, 
                        author: t.user.id, 
                        created_at: moment(t.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').valueOf() 
                    })
                    tempTweet.save( err => { if(err) console.log("Error saving")} )
                }
                catch(err){
                    console.log("Caught ERROR: ",err)
                }
            });
        }
    );
}