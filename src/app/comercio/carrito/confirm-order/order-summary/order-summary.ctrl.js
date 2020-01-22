(function() {
	'use strict';

	angular.module('chasqui').controller('OrderSummaryController', OrderSummaryController);

	/** @ngInject */
	function OrderSummaryController($scope, URLS){

    $scope.urlBase = URLS.be_base;
        
    /////////////////////////////////////
    
    function init(){
        
    }
    
    init();
    
    /////////////////////////////////////
        
	}

})();