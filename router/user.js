const router = require("express").Router();
const requireLogin = require("../Middleware/requireLogin");
const user = require("../model/user");
const tweet = require("../model/tweet");
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

router.get("/alluser", async (req, res) => {
  const response = await user.find();
  res.status(200).json({ response });
});

router.get("/singleuser/:userid", async (req, res) => {
  const { userid } = req.params;
  const response = await user.findById(userid);
  res.status(200).json({ response });
});

router.put("/edituser/:userid", async (req, res) => {
  const { userid } = req.params;
  const { location, name, dob } = req.body;
  if (!location || !name || !dob)
    res.status(400).json({ err: "pls fill the feilds" });
  try {
    const response = await user.findByIdAndUpdate(userid, {
      location,
      fullname: name,
      dob,
    });
    res.status(200).json({ response });
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/updateuser/:userid",
  uploads.single("images"),
  async (req, res) => {
    const { userid } = req.params;
    const profileImage = req?.file?.path;
    console.log(profileImage, 49);
    try {
      const response = await user.findByIdAndUpdate(userid, {
        profileImage,
      });
      const response1 = await tweet.updateMany(
        { tweetedBy: userid },
        {
          $set: {
            tweetProfileImage: profileImage,
          },
        }
      );
      res.status(200).json({ response });
      res.status(200).json({ response1 });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put("/followuser", requireLogin, async (req, res) => {
  const { userid } = req.body;
  const { _id } = req.user;
  const response = await user.findByIdAndUpdate(
    userid,
    {
      $push: { followers: _id },
    },
    { new: true }
  );

  const response1 = await user.findByIdAndUpdate(
    _id,
    {
      $push: { following: userid },
    },
    { new: true }
  );
  res.status(200).json({ msg: " successfully added followed by", response });
  res.status(200).json({ msg: " successfully added followeding", response1 });
});

router.put("/unfollowuser", requireLogin, async (req, res) => {
  const { userid } = req.body;
  const { _id } = req.user;
  const response = await user.findByIdAndUpdate(
    userid,
    {
      $pull: { followers: _id },
    },
    { new: true }
  );

  const response1 = await user.findByIdAndUpdate(
    _id,
    {
      $pull: { following: userid },
    },
    { new: true }
  );
  res.status(200).json({ msg: " successfully removed followed by", response });
  res.status(200).json({ msg: " successfully removed followeding", response1 });
});

module.exports = router;
