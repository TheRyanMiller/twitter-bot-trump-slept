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

const followerCountSchema = new Schema({ 
  follower_count: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }}, 
  { timestamps: true }
);

const FollowerCount = exports.followerCount = mongoose.model("followercount", followerCountSchema);

const replyLogSchema = new Schema({ 
  originalTweetDate: {
    type: Date,
    required: true
  },
  replyDate: {
    type: Date,
    required: true
  },
  originalTweetId: {
    type: String,
    required: true
  }, 
  replyTweetId: {
    type: String,
    required: true
  }},
  { timestamps: true }
);

const ReplyLog = exports.replyLog = mongoose.model("replylog", replyLogSchema);
