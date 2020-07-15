
var mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/thrsin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
   console.log("Db started");
    }
);