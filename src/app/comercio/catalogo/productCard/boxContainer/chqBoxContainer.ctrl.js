(function(){
	'use strict'
	/*
	* Favio Juan.
	* 11-28-2018
	*/
	angular.module('chasqui').controller('ChqBoxContainerCtrl', ChqBoxContainerCtrl);

	function ChqBoxContainerCtrl($scope){
		$scope.direccion = angular.isDefined($scope.direccion) ? $scope.direccion: 'row';
		$scope.alto = angular.isDefined($scope.alto) ? $scope.alto: 'auto';
		$scope.space = angular.isDefined($scope.space) ? $scope.space: 'space-between';
	}
}
)();
