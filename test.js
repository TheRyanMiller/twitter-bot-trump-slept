const download = require('image-downloader');
const moment = require('moment');
const Twitter = require('twitter');
const path = require('path');
const fs = require('fs');
const database = require('./dbSchemas');
require('dotenv').config();

let url="https://chart.googleapis.com/chart?chs=300x180&cht=lc&chtt=@trump_slept&chts=ff3300&chco=0033cc,224499&chds=0,8&chxt=x,x,y,y&chxl=0:|Sun|Mon|Tues|Weds|Thurs|Fri|Sat|1:|Day|2:||2|4|6|8|3:|Hours|&chxp=1,50|3,50&chls=1|1&chd=t:"
url+="7,1,6,1,1";

//Fetch Sleep data from db
let sleepValues = [];
database.sleepLog.find({createdAt : {$gt : moment().subtract(1,'week')}}).then(resp=>{
    //console.log(resp);
    let counter = 0;
    resp.forEach(log=>{
        counter++;
        hrs=Number(log.sleepDuration.split(":")[0]);
        mins=Number(log.sleepDuration.split(":")[1])+Number(log.sleepDuration.split(":")[2])/60;
        sleepValues.push(hrs+(mins/60));
        if(counter>6) return;
    })
    console.log(sleepValues)
});

let today = moment().format('MM-DD-YYYY');