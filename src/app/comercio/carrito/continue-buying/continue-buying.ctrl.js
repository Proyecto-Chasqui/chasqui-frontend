(function() {
	'use strict';

	angular.module('chasqui').controller('ContinueBuyingController', ContinueBuyingController);

	/** @ngInject */
	function ContinueBuyingController($scope, $state) {
        
        $scope.continueBuying = continueBuying;

        /////////////////////////////////////
        
        function continueBuying(){
			$state.go('catalog.products');
        }
	}

})();