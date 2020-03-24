const  express = require("express");
const { exec,spawn } = require("child_process");
const bodyParser = require('body-parser')
const fs = require('fs');
const util = require('util')
const fs_writeFile = util.promisify(fs.writeFile)
const fs_readFile = util.promisify(fs.readFile)

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.text())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post("/compile", async (req,res)=>{
	console.log(req.body);
	const data = JSON.parse(req.body);
	console.log(data);
//	const file = await fs.readFile('javaTest.java', 'utf8');
	await fs_writeFile('javaTest.java', data.code);
	const fileCode = await fs_readFile('javaTest.java');
	exec(`javac javaTest.java`, (error,stdout,stderr)=>{
		if (error) {
			console.log(`error: ${error.message}`);
			//return;
			res.status(500).send(error.message);
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			res.status(500).send("Something went wrong");
			//return;
		}else{
			res.status(200).send("Code compiled, running ...");
		}
	})
	
})

app.get("/run", async (req,res)=>{
	console.log("Running code ...");
	const  childProcess = require('child_process').spawn(
      'java', ['javaTest']
    );
	let output = '';
	
	childProcess.stdout.on('data', data=>{
		//console.log(data.toString());
		output += data.toString();
		console.log(output);
	})
	
	childProcess.stderr.on("data", function (data) {
		console.log(data);
		output += data.toString();
	});
	
	childProcess.on('close',(code)=>{
		console.log(`child process exited with code ${code}`);
		output = output.replace(/(?:\r\n|\r|\n)/g, '<br>');
		res.status(200).send(output)
	})

	
	
})

app.listen(8080, () => {
 console.log("Server running on port 8080");
});