var mongoose = require('mongoose');
var Promise = require('bluebird');
//how about a connect method?

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
	console.log("  PRE VALIDATE -> "+JSON.stringify(this));
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

var Appointment = mongoose.model('Appointment',appointmentSchema);

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

var _conn = null;
module.exports = {
  connect: function(){
    if(_conn)
      return _conn;
    _conn = new Promise(function(resolve, reject){
      mongoose.connect(process.env.CONN || 'mongodb://localhost/johng-spa', function(err){
          if(err)
            return reject(err);
          resolve(mongoose.connection);
          });
    
    });
    return _conn;
  

  },
  models: {
    Appointment: Appointment
  }
};
