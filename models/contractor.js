var mongoose = require('mongoose');

module.exports = mongoose.model('Contractor', {		// Create our Contractor model and export it
	name: String,
	image: String
});
