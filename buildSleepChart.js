const download = require('image-downloader');
const moment = require('moment');
const Twitter = require('twitter');
const path = require('path');
const fs = require('fs');
const database = require('./dbSchemas');
require('dotenv').config();


module.exports = (today) => new Promise((resolve, reject) => {

  let tempdow = 0;
  let dow = moment().day();
  if(moment().isBefore({ hour: 09, minute: 1 })) dow = dow - 1;
  dayArray = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
  let dayString = "";
  for(let i=0;i<7;i++){
      tempdow = dow + i > 6 ? dow + i - 7 : dow + i;
      dayString += dayArray[tempdow]+"|";
  }
  dayString = dayString.substring(0,dayString.length);
  let begUrl="https://chart.googleapis.com/chart?chs=300x150&cht=lc&chtt=@trump_slept&chts=ff3300&chco=0033cc,224499&chds=0,10&chxt=x,y,y&chxl=0:|"
  let endUrl = "1:||2|4|6|8|10|2:|Hours|&chxp=2,50|3,50&chls=1|1&chd=t:";
  let chartUrl = begUrl + dayString + endUrl;


  //Fetch Sleep data from db
  let sleepValues = [];

  /* Collect last 7 days of sleep logs */
  database.sleepLog.find({createdAt : {$gt : moment().subtract(1,'week')}})
  .sort({"createdAt": 1})
  .then(resp=>{
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
          dest: process.env.IMAGE_DIRECTORY_LOCATION+today+'.jpg'
      }
      download.image(options)
      .then(({ filename }) => {
          console.log("Image saved...");
          
          resolve();
      })
      .catch((err) => console.error(err))
  })
})
