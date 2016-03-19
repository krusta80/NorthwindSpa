var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');

var appointmentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	priority: {type: Number, required: true, min: 1}
});

appointmentSchema.virtual('priorityFloor')
.get(function() {
	return Math.floor(this.priority);
});

appointmentSchema.set('toJSON', {
	virtuals : true
});

appointmentSchema.pre('validate', function(next) {
	if(!this.priority)
		this.priority = 5;
	if(this.isNew && this.priority !== this.priorityFloor)
		throw new Error('Priority must be a whole number!');
	next();
});

appointmentSchema.pre('save', function(next) {
	if(this.isNew)
		this.priority += getTS();
	next();
});

var appointmentModel = mongoose.model('Appointment',appointmentSchema);

function getTS() {
	/*	
		This returns ms since the epoch in decimal form,
		which ensures that every appointment has a unique 
		priority, even if the integer portion (priorityFloor)
		is non-unique.  

		With this system in place, moving an appointment up 
		and down is as simple as swapping its priority with
		its upper or lower neighbor respectively.  :)

		Using a timestamp also ensures that a new appointment 
		is always added directly BELOW any existing appointments 
		sharing the same priorityFloor.
	*/

	var ts = new Date();
	return ts/Math.pow(10,Math.ceil((Math.log(ts)/Math.log(10))));
}

module.exports = appointmentModel;