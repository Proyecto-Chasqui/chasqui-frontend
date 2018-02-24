(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogController', CatalogController);

    
	function CatalogController($scope, sellerService, CTE_REST, $stateParams) {
                
        $scope.catalog = {id: 0};
        
        sellerService.getSellers().then(function(response){
            $scope.catalog = response.data.filter(function(c){return c.id == $stateParams.id})[0];
            console.log("catalog", $scope.catalog);
        });
        
        $scope.url = function(path){
            return CTE_REST.url_base + path;
        }
	}
})();
