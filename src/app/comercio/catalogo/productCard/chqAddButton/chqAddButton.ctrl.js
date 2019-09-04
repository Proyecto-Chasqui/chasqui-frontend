(function(){
	'use strict'
	/*
	* Favio Juan.
	* 11-7-2018
	*/
	angular.module('chasqui').controller('ChqAddButtonCtrl', ChqAddButtonCtrl);

	function ChqAddButtonCtrl($scope){
		$scope.color = angular.isDefined($scope.color) ? $scope.color: '#43a047';
		$scope.text = angular.isDefined($scope.text) ? $scope.text: '';
		$scope.textColor = angular.isDefined($scope.textColor) ? $scope.textColor: '#fff';
		$scope.title = angular.isDefined($scope.title) ? $scope.title: '';
	}
}
)();
