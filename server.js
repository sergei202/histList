var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://okcoders:okcoders@okcoders.co/hitlist');		// Connect to the hitList database
mongoose.Promise = Promise;								// Tell mongoose to our ES6 promises

var app = express();
app.use(bodyParser());									// bodyParser will parse POST request body into req.body
app.use(express.static('./public'));					// Serve our static content

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log('Listening at http://localhost:'+port);
});

var Contractor = require('./models/contractor');		// Import our Contractor model
var Hit = require('./models/hit');						// Import our Hit model from models/hit.js

initContractors();

function initContractors() {							// This function first checks if data exists and adds it if it doesn't
	return Contractor.count().then(function(count) {	// Count how many contractors are in our database
		if(count) return;								// If even one exists, don't create anymore and bail out.

		var contractors = [								// Define our list of contractors that we want inserted
			{name:'Pablo Escobar',	image:'https://pbs.twimg.com/profile_images/603082303200301056/AFKWvroi_400x400.jpg'},
			{name:'Al Capone',		image:'http://media.todaybirthdays.com/thumb_x256x256/upload/1899/01/17/al-capone.jpg'},
			{name:'John Dillinger',	image:'https://pbs.twimg.com/profile_images/632169869312589824/3lAuq8yn.jpg'},
			{name:'Frank Costello',	image:'http://p1.pstatp.com/large/5b10002c4ef3d28044c'}
		];

		contractors.forEach(function(contractor) {		// Loop through each element
			contractor = new Contractor(contractor);	// Create a document from our model
			return contractor.save();					// Save the document
		});
	});
}

app.get('/contractors', function(req,res) {
	Contractor.find().exec().then(function(contractors) {		// Find all contractors and then...
		res.json(contractors);									// Respond with the list of contractors
	});
});


app.get('/hits', function(req,res) {													// Return all the hits in the Hit models (the hits collection)
	Hit.find().populate('contractor').sort({bounty:-1}).exec().then(function(hits) {	// Find all hits, populate contractor, sort by bounty descending, execute, and then...
		res.json(hits);																	// Return the hits array
	}, err => res.status(400).json(err));
});

app.post('/hits', function(req,res) {			// Anything POSTed to /hits will either be created or updated (depending if _id is defined)
	var hit = req.body;							// Reference req.body as hit for ease
	if(hit._id) {								// If hit._id exists then we know we are updating an existing document
		Hit.findOneAndUpdate({_id:hit._id}, hit).exec().then(function() {	// Find ONE document that matches {_id:hit._id} and set it's properties to the properties in 'hit'
			res.json(true);						// Return something arbitrary to let our client-side know we are done
		});
	} else {									// Else if hit._id is NOT defined...  we are creating a new document
		var newHit = new Hit(hit);				// Create a new document using the Hit model.  We set all of its properties to 'hit' (what was passed from the client)
		newHit.save().then(function() {			// we save newHit and then...
			res.json(true);						// Tell the client-side we are done
		});
	}
});

app.delete('/hits/:id', function(req,res) {
	var id = req.params.id;
	Hit.findOneAndRemove({_id:id}).exec().then(function() {
		res.json(true);
	});
});
