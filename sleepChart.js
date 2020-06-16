const download = require('image-downloader');
const moment = require('moment');
const Twitter = require('twitter');
const path = require('path');
const fs = require('fs');
const database = require('./dbSchemas');
require('dotenv').config();


module.exports = () => {

  let chartUrl="https://chart.googleapis.com/chart?chs=300x180&cht=lc&chtt=@trump_slept&chts=ff3300&chco=0033cc,224499&chds=0,10&chxt=x,y,y&chxl=0:|Sun|Mon|Tues|Weds|Thurs|Fri|Sat|1:||2|4|6|8|10|2:|Hours|&chxp=2,50|3,50&chls=1|1&chd=t:"

  //Fetch Sleep data from db
  let sleepValues = [];
  let today = moment().format('MM-DD-YYYY');

  let client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  /* Collect last 7 days of sleep logs */
  database.sleepLog.find({createdAt : {$gt : moment().subtract(1,'week')}}).then(resp=>{
      let counter = 0;
      resp.forEach(log=>{
          counter++;
          hrs=Number(log.sleepDuration.split(":")[0]);
          mins=Number(log.sleepDuration.split(":")[1])+Number(log.sleepDuration.split(":")[2])/60;
          sleepValues.push(hrs+(mins/60));
          if(counter>6) return;
      })
      sleepValues.forEach(v=>{
        chartUrl+=v+",";
      })
      chartUrl = chartUrl.substring(0, chartUrl.length - 1);
      const options = {
          url: chartUrl,
          dest: './charts/'+today+'.jpg'
      }


      download.image(options)
      .then(({ filename }) => {
          console.log("Image saved...")
          uploadAndTweet();
      })
      .catch((err) => console.error(err))
  })

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
