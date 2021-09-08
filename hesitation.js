//These two lines are imports- bring in the apis that we need for this code.
// ./ is linux or unix . means this current directory and / means in this folder
//write to data in a text file
// Requiring fs module in which 
// writeFile function is defined. 
var TJBot = require('tjbot');
var config = require('./config');
const fs = require('fs') 

// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
//var WORKSPACEID = config.workspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['microphone', 'speaker', 'led'];


// obtain TJBot's configuration from config.js
var tjConfig = config.tjConfig;

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// TJ opening remarks
console.log("Hello. I'm the ToastMasters Bot. If you'd like to practice presenting, I can give you some feedback.");
console.log("Try saying, \"" + tj.configuration.robot.name + ", start recording\" or \"" + tj.configuration.robot.name + ", stop recording\"");
console.log("At the end you can ask, \"" + tj.configuration.robot.name + ", How did I do?\"");

// Setting up variables
let recording = false;
let name = tj.configuration.robot.name.toLowerCase()
let start = name + " start recording"
let stop = name + " stop recording"
let stopped = name + " stopped recording"
let transcript = 'transcript.txt'

// creates transcript file and replaces the existing one
fs.open(transcript, 'w+', function(err) {
	if (err) {
		throw "could not open file: " + err
	}
});

// Main listening callback function
tj.listen(function(input) {
	input = input.toLowerCase()
	if (recording) {
		stop_record = input.includes(stop) || input.includes(stopped) //tj often hears stopped so we added both
		if (stop_record) {
			console.log("stopping recording")
			recording = false;
			let hesitationCounter = 0
			var words = fs.readFileSync(transcript);	//reading words in transcript file
			words = words.toString();
			words = words.split(" ");
			for (var i = 0; i < words.length; i++) {
				if (words[i] == '%hesitation'){
					hesitationCounter++;			//increment counter when um/hesitation is heard
				}
			}
			console.log("Number of 'ums': " + hesitationCounter)
		} else {
			fs.appendFile(transcript, input, function (err) {
				if (err) throw err;
				console.log("wrote to transcript: " + input)
			});
		}
	} else {
		start_record = input.includes(start)
		stop_record = input.includes(stop)
		console.log(input)
		console.log("start: " + start_record)
		console.log("stop: " + stop_record)
		if (start_record) {
			console.log("starting recording")
			recording = true;
		} else {
			console.log("Try saying, \"" + tj.configuration.robot.name + ", start recording\"")
		}
	}
})
