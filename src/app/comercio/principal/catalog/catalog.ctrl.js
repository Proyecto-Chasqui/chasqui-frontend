(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogController', CatalogController);

    
	function CatalogController($scope, sellerService, CTE_REST, $stateParams, catalogs_dao) {
                
        $scope.catalog = catalogs_dao.getCatalog($stateParams.id);
                
        $scope.url = function(path){
            return CTE_REST.url_base + path;
        }
	}
})();
