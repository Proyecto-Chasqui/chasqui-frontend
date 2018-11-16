(function(){
	'use strict'
	
	angular.module('chasqui').controller('ChqBoxContainerCtrl', ChqBoxContainerCtrl);

	function ChqBoxContainerCtrl($scope){
		$scope.direccion = angular.isDefined($scope.direccion) ? $scope.direccion: 'row';
		$scope.alto = angular.isDefined($scope.alto) ? $scope.alto: 'auto';
	}
}
)();
