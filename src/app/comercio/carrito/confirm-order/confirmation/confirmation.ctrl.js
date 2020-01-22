(function() {
	'use strict';

	angular.module('chasqui').controller('ConfirmationController', ConfirmationController);

	/** @ngInject */
	function ConfirmationController($scope, URLS){
    
    $scope.urlBase = URLS.be_base;
    
    /////////////////////////////////////
    
    function init(){
        
    }
    
    init();
    
    /////////////////////////////////////
        
	}

})();