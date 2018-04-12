(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('HomeController', HomeController);

    
	function HomeController($scope, URLS, contextCatalogsService, $state) {
        
        $scope.catalogs = [];
        $scope.url = url;
        $scope.goToCatalog = goToCatalog;
        
        
        function url(path){
            return URLS.be_base + path;
        }
        
        function goToCatalog(catalogShortName){
            $state.go('catalog.landingPage', {catalogShortName: catalogShortName});
        }
        
        function init(){
            contextCatalogsService.getCatalogs().then(function(catalogs){
                $scope.catalogs = catalogs;
            })
        }
        
        init();
	}
})();
