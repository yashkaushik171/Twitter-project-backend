const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const user = require("../model/user");

const tweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    tweetedBy: {
      type: ObjectId,
      ref: user,
    },
    author: {
      type: Object,
    },
    tweetProfileImage: {
      type: String,
    },
    likes: [
      {
        type: ObjectId,
        ref: user,
      },
    ],

    retweetedBy: [
      {
        type: ObjectId,
        ref: user,
      },
    ],

    images: {
      type: String,
      default: "images",
    },
    replies: [
      {
        type: Object,
      },
    ],
    repliedTo: {
      type: ObjectId,
    },
    tweetedAt: {
      type: String,
      require: true,
    },
  },

  {
    timestamps: true,
  }
);

const tweet = mongoose.model("Tweet", tweetSchema);

module.exports = tweet;
