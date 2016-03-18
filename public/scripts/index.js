var spaModule = angular.module('spa', []);

spaModule.controller('SpaController', function($scope, $http) {
	
	$http.get('/api/appointments').then(function(response) {
		return response.data;
	}).then(function(appointments) {
		$scope.appointments = appointments;
	}).catch(console.error.bind(console));

});

