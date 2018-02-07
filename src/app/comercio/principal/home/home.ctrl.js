(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('HomeController', HomeController);

    
	function HomeController($scope, sellerService, CTE_REST) {
        
        $scope.catalogs = [];
        
        sellerService.getSellers().then(function(response){
            $scope.catalogs = response.data;
        });
        
        $scope.url = function(path){
            return CTE_REST.url_base + path;
        }
	}
})();
