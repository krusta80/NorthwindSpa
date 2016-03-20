angular.module('spa', []);

function isNotAWholeNumber(input) {
	if(!input) return false;
	if(isNaN(input)) return true;
	if(input < 1) return true;
	return input != Math.floor(input);
}

angular.module('spa').controller('SpaController', function($scope, $http, $window) {
	
	$scope.refreshAppointments = function() {
		$http.get('/api/appointments')
		.then(function(response) {
			return response.data;
		})
		.then(function(appointments) {
			$scope.appointments = appointments;
      $scope.appt = {
        name: '',
        priority: ''
      
      };
			$scope.displayError = false;
			$window.document.getElementById("newName").focus();
		})
		.catch(console.error.bind(console));
	};

	$scope.moveUp = function(index) {
		$scope.swapSpots(index - 1, index);
	};
	
	$scope.moveDown = function(index) {
		$scope.swapSpots(index, index + 1);
	};

	$scope.swapSpots = function(index1,index2) {
		var url1 = '/api/appointments/'+$scope.appointments[index1]._id;
		var data1 = { priority: $scope.appointments[index2].priority };
		var appt1;

    //consider using $q.all -- these calls are independent.. no?
		
		$http.put(url1, data1)
		.then(function(response) {
			return response.data;
		})
		.then(function(appointment) {
			console.log("updated appointment " + appointment._id);
			appt1 = appointment;
			var url2 = '/api/appointments/' + $scope.appointments[index2]._id;
			var data2 = {priority: $scope.appointments[index1].priority};
			return $http.put(url2, data2);
		})
		.then(function(response) {
			return response.data;
		})
		.then(function(appointment) {
			console.log("updated appointment " + appointment._id);
			var appt2 = appointment;
			$scope.appointments[index1] = appt2;
			$scope.appointments[index2] = appt1;
		})
		.catch(console.error.bind(console));
	};
	
	$scope.delete = function(index) {
		$http.delete('/api/appointments/' + $scope.appointments[index]._id)
		.then(function(response) {
			return response.data;
		})
		.then(function(appointment) {
			$scope.appointments.splice(index,1);
			console.log("removed appointment " + appointment._id);
		})
		.catch(console.error.bind(console));
	};

	$scope.addProduct = function() {
		if(isNotAWholeNumber($scope.appt.priority)) {
			$scope.displayFormError("Priority must be a whole number!");
			return;
		}
		$http.post('/api/appointments', $scope.appt)
		.then(function(response) {
			$scope.refreshAppointments();
		})
		.catch($scope.displayFormError);
	};

	$scope.displayFormError = function(err) {
		$scope.displayError = true;
		$scope.errorMessage = "Processing error";
		$window.document.getElementById("newName").focus();
		console.log(err);
	};

	$scope.refreshAppointments();
	
});

