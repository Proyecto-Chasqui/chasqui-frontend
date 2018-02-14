(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogController', CatalogController);

    
	function CatalogController($scope, sellerService, CTE_REST, $stateParams, catalogs_dao, contextPurchaseService) {
                
        $scope.catalog = catalogs_dao.getCatalog($stateParams.idCatalog);
        
        contextPurchaseService.refresh();
        
        $scope.url = function(path){
            return CTE_REST.url_base + path;
        }
	}
})();