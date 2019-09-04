(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogController', CatalogController);

    
	function CatalogController($log, $scope, contextCatalogsService, URLS, $stateParams, contextPurchaseService) {
           
        $scope.url = url;
        
        function init(){
            contextCatalogsService.getCatalogs().then(function(catalogs){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    contextPurchaseService.setContextByCatalog(catalog);
                    $scope.catalog = catalog;
                })
            })
        }
                                                      
        function url(path){
            return be_base.be_base + path;
        }
        
        $scope.$on('resetCatalogInfo', function(event, msg) {
            $log.debug("resetCatalogInfo");
            init();
        });    
    
    
        init();
	}
})();