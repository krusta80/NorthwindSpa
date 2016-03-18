var express = require('express');
var router = express.Router();
var Appointment = require('../models');

router.get('/appointments', function(req,res) {
	Appointment.find({}).sort({priority: 1, name: 1})
	.then(function(appointments) {
		res.send(appointments);
	})
	.catch(console.log);
});

router.post('/appointment', function(req,res) {
	var appointment = new Appointment();

	appointment.name = req.body.name;
	appointment.priority = req.body.priority;

	appointment.save()
	.then(function(appointment) {
		res.send(appointment);
	})
	.catch(console.log);
});

router.delete('/appointment/:id', function(req,res) {
	Appointment.findByIdAndRemove(req.params.id)
	.then(function(appointment) {
		res.send(appointment);
	})
	.catch(console.log);
});

router.put('/appointment/:id', function(req,res) {
	Appointment.findById(req.params.id)
	.then(function(appointment) {
		appointment.name = req.body.name;
		appointment.priority = req.body.priority;
		return appointment.save();
	})
	.then(function(appointment) {
		res.send(appointment);
	})
	.catch(console.log);
});

module.exports = router;