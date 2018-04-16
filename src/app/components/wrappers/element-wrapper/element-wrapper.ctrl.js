(function() {
	'use strict';
    
    angular.module('chasqui').controller('ElementWrapperCtrl', ElementWrapperCtrl);
    
	function ElementWrapperCtrl($scope, contextPurchaseService, contextCatalogsService, catalogSupportStrategies) {
        
        $scope.showElement = false;
        
        function init(){
            contextCatalogsService.getCatalogs().then(function(catalogs){
                contextPurchaseService.getSelectedCatalog().then(function(catalog){
                    $scope.showElement = catalogSupportStrategies(catalog, $scope.supportedStrategies);
                });
            });
        }
        
        init();
    }
    
})();