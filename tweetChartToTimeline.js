const download = require('image-downloader');
const moment = require('moment');
const Twitter = require('twitter');
const path = require('path');
const fs = require('fs');
const database = require('./dbSchemas');
const buildChart = require('./buildSleepChart');
require('dotenv').config();


module.exports = () => {

  let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  let today = moment().format('MM-DD-YYYY');

  //Call script to build chart based on last 7 days
  buildChart(today).then( result => {
    uploadAndTweet();
  });
  

  /* Upload Image and Tweet it out */
  const uploadAndTweet = () => {
    let image_path = path.join(__dirname, '/charts/'+today+'.jpg');
    let b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    console.log('Uploading an image...');

    client.post('media/upload', { media_data: b64content }, function (err, data, response) {
      if (err){
        console.log('ERROR:');
        console.log(err);
      }
      else{
        console.log('Image uploaded!');
        client.post('statuses/update', {
            status: "My sleep stats for the week ending "+today,
            media_ids: data.media_id_string
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
  };
}
