const express = require("express");
const request = require('request');
const { exec, spawn } = require("child_process");
const bodyParser = require("body-parser");
const fs = require("fs");
const util = require("util");
const fs_writeFile = util.promisify(fs.writeFile);
const fs_readFile = util.promisify(fs.readFile);
const mongoose = require("mongoose");
const routes = require("./routes/app");
const tutorRoutes = require("./routes/tutorRoutes");
const studentRoutes = require("./routes/studentRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const forumRoutes = require("./routes/forumRouter");
const auth = require("./auth");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

mongoose
  .connect(
    "mongodb+srv://DB:mongodbatlas@cluster0-8pbfx.mongodb.net/test?retryWrites=true&w=majority",
  )
  .then(() => console.log("DB connected"));

app.post("/compile", async (req, res) => {
  const data = JSON.parse(req.body);
  await fs_writeFile("javaTest.java", data.code);
  const fileCode = await fs_readFile("javaTest.java");
  exec(`javac javaTest.java`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      res.status(500).send(error.message);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      res.status(500).send("Something went wrong");
    } else {
      res.status(200).send("Code compiled, running ...");
    }
  });
});

app.get("/run", async (req, res) => {
  console.log("Running code ...");
  const childProcess = require("child_process").spawn("java", ["javaTest"]);
  let output = "";

  childProcess.stdout.on("data", (data) => {
    output += data.toString();
    console.log(output);
  });

  childProcess.stderr.on("data", function (data) {
    console.log(data);
    output += data.toString();
  });

  childProcess.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
    output = output.replace(/(?:\r\n|\r|\n)/g, "<br>");
    res.status(200).send(output);
  });
});

app.get('/data/:id',(req,res,next)=>{
  console.log(req.params.id);
  let c = req.params.id;
  //console.log(c);
    request(`https://clist.by:443/api/v1/contest/?resource__id=${c}&start__gte=2020-1-4T00%3A00%3A00&order_by=-start&username=mab&api_key=16f0b8a357675130b0756dc337fe50bb76753053`,
     function (error, response, body) {
         res.send(body)
    });  
});

mongoose.Promise = global.Promise;

app.use("/tutor", tutorRoutes);
app.use("/student", studentRoutes);
app.use("/",  auth.verifyAuthentication, routes);
app.use("/feedback", auth.verifyAuthentication, feedbackRoutes);
app.use("/",  auth.verifyAuthentication, forumRoutes);
//error handling
app.use(function (err, req, res, next) {
  res.status(403).send({ error: err.message });
});

app.listen(5000, () => {
  console.log("Server running on port 5000 ------");
});
