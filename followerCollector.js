const download = require('image-downloader');
const moment = require('moment');
const Twitter = require('twitter');
const database = require('./dbSchemas');
require('dotenv').config();

module.exports = () => {
    let client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    client.get('users/show', {
        screen_name: "trump_slept",
        stringify_ids: true,
        count: 5000
    },  
        function(error, tweet, response) {
            if(error) console.log(error);
            //throw error
            let followerCount = new database.followerCount({
                follower_count: Number(tweet.followers_count), 
                date: new Date()
            });
            followerCount.save().then( err => {
                if(err) console.log(err);
            })
        }
    );
}