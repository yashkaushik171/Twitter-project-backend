const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);

// Connect MongoDB at default port 27017.
mongoose
  .connect("mongodb+srv://kaushik:yashkaushik@cluster0.wkiq1cx.mongodb.net/Twitter-app?retryWrites=true&w=majority", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
