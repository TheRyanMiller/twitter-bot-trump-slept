const mongoose = require("./mongoose.service").mongoose;
const Schema = mongoose.Schema;

const tweetSchema = new Schema({ 
    id: { 
      type: String, 
      unique: true,
      required: true 
    }, 
    status: { 
      type: String, 
      required: true 
    }, 
    author: {
      type: String,
      required: true 
    },
    created_at: {
      type: Date,
      required: true
    }
});

const Tweet = exports.tweet = mongoose.model("tweet", tweetSchema);

const sleepLogSchema = new Schema({ 
  date: {
    type: String,
    required: true
  },
  sleepDuration: {
    type: String,
    required: true
  }}, 
  { timestamps: true }
);

const SleepLog = exports.sleepLog = mongoose.model("sleeplog", sleepLogSchema);