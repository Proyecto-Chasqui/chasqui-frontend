(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogController', CatalogController);

    
	function CatalogController($scope, sellerService, URLS, $stateParams, catalogs_dao, catalogs_data, contextPurchaseService) {
                
        contextPurchaseService.setContextByCatalog(catalogs_dao.getCatalogByShortName($stateParams.catalogShortName));
        
        $scope.catalog = catalogs_dao.getCatalogByShortName($stateParams.catalogShortName);
        
        $scope.url = function(path){
            return be_base.be_base + path;
        }
	}
})();