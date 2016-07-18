var mongoose = require('mongoose');

module.exports = mongoose.model('Hit', {									// Create a model called Hit and export it
	name: String,
	bounty: Number,
	location: String,
	contractor: {type:mongoose.Schema.Types.ObjectId, ref:'Contractor'},	// contractor is an ObjectId that references the Contractor model
	status: String,
	bids: [{
		name: String,			// The bidder's name
		amount: Number,			// The bid amount
		days: Number			// Number of days to complete the job
	}]
});
