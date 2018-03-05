(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogController', CatalogController);

    
	function CatalogController($scope, sellerService, CTE_REST, $stateParams, catalogs_dao, catalogs_data, contextPurchaseService) {
                
        contextPurchaseService.setContextByCatalog(catalogs_dao.getCatalogByShortName($stateParams.catalogShortName));
        
        $scope.catalog = catalogs_dao.getCatalogByShortName($stateParams.catalogShortName);
        
        $scope.url = function(path){
            return CTE_REST.url_base + path;
        }
	}
})();