(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogController', CatalogController);

    
	function CatalogController($scope, sellerService, CTE_REST, $stateParams, catalogs_dao, catalogs_data, contextPurchaseService) {
                
        $scope.catalog = catalogs_dao.getCatalog($stateParams.idCatalog);
        
        contextPurchaseService.setContextByCatalog(catalogs_dao.getCatalog($stateParams.idCatalog));
        
        catalogs_data.addCatalog($scope.catalog.id.toString());
        
        
        $scope.url = function(path){
            return CTE_REST.url_base + path;
        }
	}
})();