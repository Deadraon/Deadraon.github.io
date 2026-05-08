const mongoose = require("mongoose");
const uri = "mongodb://chauhankunal695_db_user:JrpfsTcEsjgNc0WA@ac-f4lqyyu-shard-00-00.hmamkq2.mongodb.net:27017,ac-f4lqyyu-shard-00-01.hmamkq2.mongodb.net:27017,ac-f4lqyyu-shard-00-02.hmamkq2.mongodb.net:27017/deadraon?ssl=true&replicaSet=atlas-f4lqyy-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAIL:", err.message);
    process.exit(1);
  });
