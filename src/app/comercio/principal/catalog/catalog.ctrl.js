(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogController', CatalogController);

    
	function CatalogController($scope, contextCatalogsService, URLS, $stateParams, contextPurchaseService) {
           
        $scope.url = url;
        
        function init(){
            contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                contextPurchaseService.setContextByCatalog(catalog);
                $scope.catalog = catalog;
            })
        }
        
        init();
        
        function url(path){
            return be_base.be_base + path;
        }
	}
})();