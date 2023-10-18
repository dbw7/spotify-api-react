const express = require("express");
const cors = require('cors')

const { authRouter } = require("./auth");


const app = express();
app.use(cors());

app.use('/auth', authRouter)



app.listen(5000, () => {
  console.log("App is listening on port 5000!\n");
});

app.get("/", (req, res) => {
  res.send("Hello");
});

// get user info
