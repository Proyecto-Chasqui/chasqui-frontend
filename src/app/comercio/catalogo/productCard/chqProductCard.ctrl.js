(function(){
	'use strict'
	/*
	* Adaptable Card.
	* Favio Juan.
	* 11-28-2018
	*/
	angular.module('chasqui').controller('ChqProductCardCtrl', ChqProductCardCtrl);

	function ChqProductCardCtrl($scope){
		$scope.producto = $scope.data;
	}
}
)();
