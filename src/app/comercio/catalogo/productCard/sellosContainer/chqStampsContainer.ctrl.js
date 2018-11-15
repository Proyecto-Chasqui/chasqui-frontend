(function(){
	'use strict'
	/*
	* Favio Juan.
	* 11-28-2018
	*/
	angular.module('chasqui').controller('ChqStampsContainerCtrl', ChqStampsContainerCtrl);

	function ChqStampsContainerCtrl($scope){
		$scope.direccion = angular.isDefined($scope.direccion) ? $scope.direccion: 'row';
		$scope.alto = angular.isDefined($scope.alto) ? $scope.alto: 'auto';
	}
}
)();
