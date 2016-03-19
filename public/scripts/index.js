var spaModule = angular.module('spa', []);

spaModule.controller('SpaController', function($scope, $http) {
	
	$http.get('/api/appointments')
	.then(function(response) {
		return response.data;
	})
	.then(function(appointments) {
		$scope.appointments = appointments;
	})
	.catch(console.error.bind(console));

	$scope.moveUp = function(index) {
		$scope.swapSpots(index-1,index);
	}
	
	$scope.moveDown = function(index) {
		$scope.swapSpots(index,index+1);
	}

	$scope.swapSpots = function(index1,index2) {
		var url1 = '/api/appointment/'+$scope.appointments[index1]._id;
		var data1 = {priority: $scope.appointments[index2].priority};
		var appt1;
		
		$http.put(url1,data1)
		.then(function(response) {
			return response.data;
		})
		.then(function(appointment) {
			console.log("updated appointment "+appointment._id);
			appt1 = appointment;
			var url2 = '/api/appointment/'+$scope.appointments[index2]._id;
			var data2 = {priority: $scope.appointments[index1].priority};
			return $http.put(url2,data2);
		})
		.then(function(response) {
			return response.data;
		})
		.then(function(appointment) {
			console.log("updated appointment "+appointment._id);
			var appt2 = appointment;
			$scope.appointments[index1] = appt2;
			$scope.appointments[index2] = appt1;
		})
		.catch(console.error.bind(console));
	}
	
	$scope.delete = function(index) {
		$http.delete('/api/appointment/'+$scope.appointments[index]._id)
		.then(function(response) {
			return response.data;
		})
		.then(function(appointment) {
			$scope.appointments.splice(index,1);
			console.log("removed appointment "+appointment._id);
		})
		.catch(console.error.bind(console));
	}

});

