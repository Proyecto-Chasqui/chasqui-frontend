(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('HomeController', HomeController);

    
	function HomeController($scope, sellerService, CTE_REST, catalogs_dao) {
        
        $scope.catalogs = catalogs_dao.getCatalogs();
        
        /*sellerService.getSellers().then(function(response){
            $scope.catalogs = response.data;
        });
        */
        
        $scope.url = function(path){
            return CTE_REST.url_base + path;
        }
	}
})();
