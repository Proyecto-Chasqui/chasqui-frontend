(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('HomeController', HomeController);

    
	function HomeController($scope, sellerService, URLS, catalogs_dao, $state) {
        
        $scope.catalogs = catalogs_dao.getCatalogs();
        
        /*sellerService.getSellers().then(function(response){
            $scope.catalogs = response.data;
        });
        */
        
        $scope.url = function(path){
            return URLS.be_base + path;
        }
        
        $scope.goToCatalog = function(catalogShortName){
            $state.go('catalog.landingPage', {catalogShortName: catalogShortName});
        }
	}
})();
