(function(){
	'use strict'
	/*
	* Favio Juan.
	* 11-7-2018
	*/
	angular.module('chasqui').controller('ChqButtonCtrl', ChqButtonCtrl);

	function ChqButtonCtrl($scope){
		$scope.color = angular.isDefined($scope.color) ? $scope.color: 'green';
		$scope.text = angular.isDefined($scope.text) ? $scope.text: '';
	}
}
)();
