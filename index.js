const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());

require("./db/conn");
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// link our routering part
app.use("/images", express.static("./Images"));
app.use(require("./router/auth"));
app.use(require("./router/tweets"));
app.use(require("./router/user"));

app.listen(PORT, () => {
  console.log(`listening at port no. ${PORT}`);
});
