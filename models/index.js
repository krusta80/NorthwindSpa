var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');

var appointmentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	priority: {type: Number, required: true, min: 1}
});

appointmentSchema.pre('validate', function(next) {
	if(!this.priority)
		this.priority = 5;
	next();
});

var appointmentModel = mongoose.model('Appointment',appointmentSchema);

module.exports = appointmentModel;