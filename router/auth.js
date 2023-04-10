const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
SECRET_KEY = "MYNAMEISYASH";

const user = require("../model/user");

router.get("/", (req, res) => {
  res.send("hello world");
});

// registering of the users

router.post("/signup", async (req, res) => {
  const { fullname, email, username, password, joined } = req.body;
  console.log(fullname, email, username, password, 16);
  if (!fullname || !email || !username || !password)
    res.status(402).json({ err: " please fill the fields properly" });

  const didEmailExist = await user.findOne({ email });
  const didUsernameExist = await user.findOne({ username });

  if (didEmailExist) res.status(401).json({ err: "email already registered." });
  if (didUsernameExist)
    res.status(403).json({ err: "username already taken." });

  const response = new user({ fullname, email, username, password, joined });
  // hashing our password using Schema.pre( save)
  await response.save();

  res.status(201).json({ msg: "Succesfully Registered." });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      res.status(403).json({ err: "pls fill the field properly" });

    const response = await user.findOne({ email });

    if (response) {
      const isMatched = await bcrypt.compare(password, response.password);
      if (isMatched) {
        //   generating token when password is matched

        const { _id, fullname, email,username } = response;
        const payload = { _id, fullname, email ,username };
        jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" }, (err, token) => {
          if (err) res.status(401).json({ err });
          res
            .status(201)
            .json({ msg: "logged in successfully ", token, payload });
        });
      } else res.status(402).json({ err: "Invalid details" });
    } else res.status(402).json({ err: "Invalid detailsss" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
