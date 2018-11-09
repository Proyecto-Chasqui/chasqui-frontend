(function(){
	'use strict'
	/*
	* Favio Juan.
	* 11-28-2018
	*/
	angular.module('chasqui').controller('ChqBoxContainerCtrl', ChqBoxContainerCtrl);

	function ChqBoxContainerCtrl($scope){
		$scope.direction = angular.isDefined($scope.direction) ? $scope.direction: 'row';
		$scope.height = angular.isDefined($scope.height) ? $scope.height: 'auto';
	}
}
)();
