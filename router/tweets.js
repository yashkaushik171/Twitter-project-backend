const router = require("express").Router();
const mongoose = require("mongoose");
const tweet = require("../model/tweet");
const user = require("../model/user");
const requireLogin = require("../Middleware/requireLogin");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploads = multer({ storage });
const date = new Date();

router.get("/alltweets", requireLogin, async (req, res) => {
  const response = await tweet.find();
  res.status(200).json({ response });
});

router.get("/singletweet/:id", async (req, res) => {
  const { id } = req.params;
  const response = await tweet.findById(id);
  res.status(200).json({ response });
});

router.get("/singleusertweet/:userid", requireLogin, async (req, res) => {
  const { userid } = req.params;
  const response = await tweet.find({
    tweetedBy: {
      _id: userid,
    },
  });
  res.status(200).json({ response });
});

router.post(
  "/createtweet",
  requireLogin,
  uploads.single("images"),
  async (req, res) => {
    const { content } = req.body;
    const images = req?.file?.path;
    const { _id, fullname, username, profileImage } = req.user;

    if (!content) res.status(400).json({ err: "pls fillthe fields" });

    const response = await tweet({
      content,
      tweetedAt: date.toDateString(),
      images,
      tweetedBy: _id,
      author: {
        fullname,
        username,
      },
      tweetProfileImage: profileImage,
    });

    res.status(200).json({ response });
    response.save();
  }
);

router.put("/replytweet", requireLogin, async (req, res) => {
  const { content } = req.body;
  const tweetid = req.body.tweetid;
  console.log(tweetid, 71);
  const { _id, fullname, username, profileImage } = req.user;

  const response = await tweet({
    content,
    tweetedAt: date.toDateString(),
    tweetedBy: _id,
    author: {
      fullname,
      username,
    },
    tweetProfileImage: profileImage,
    repliedTo: tweetid,
  });
  response.save();

  const response1 = await tweet.findByIdAndUpdate(tweetid, {
    $push: {
      replies: response._id,
    },
  });

  res.status(200).json({ response1 });
});

router.put("/liketweet", requireLogin, async (req, res) => {
  const { _id, fullname, username } = req.user;
  const { tweetid } = req.body;

  const response = await tweet.findByIdAndUpdate(tweetid, {
    $push: {
      likes: {
        _id,
      },
    },
  });
  res.status(200).json({ response });
});

router.put("/unliketweet", requireLogin, async (req, res) => {
  const { _id, fullname, username } = req.user;
  const { tweetid } = req.body;

  const response = await tweet.findByIdAndUpdate(tweetid, {
    $pull: {
      likes: _id,
    },
  });
  res.status(200).json({ response });
});

router.put("/deletetweet", async (req, res) => {
  const { tweetid } = req.body;
  const id = new mongoose.Types.ObjectId(tweetid);
  console.log(id, 126);
  const deletedTweetResponse = await tweet.findById(tweetid);
  const response = await tweet.deleteMany({ _id: tweetid });
  console.log(deletedTweetResponse?.repliedTo, 126);
  if (deletedTweetResponse?.repliedTo) {
    await tweet.findByIdAndUpdate(deletedTweetResponse?.repliedTo, {
      $pull: {
        replies: id,
      },
    });
  }
  res.status(200).json({ response });
});

router.put("/retweet", requireLogin, async (req, res) => {
  const { _id, fullname, username } = req.user;
  const { tweetid } = req.body;

  const response = await tweet.findByIdAndUpdate(tweetid, {
    $push: {
      retweetedBy: {
        _id,
      },
    },
  });
  res.status(200).json({ response });
});

module.exports = router;
