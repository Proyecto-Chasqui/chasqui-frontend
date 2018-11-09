(function(){
	'use strict'
	/*
	* Favio Juan.
	* 11-28-2018
	*/
	angular.module('chasqui').controller('ChqPriceProductCtrl', ChqPriceProductCtrl);

	function ChqPriceProductCtrl($scope){
		$scope.entero = '$'.concat($scope.entero);
	}
}
)();
