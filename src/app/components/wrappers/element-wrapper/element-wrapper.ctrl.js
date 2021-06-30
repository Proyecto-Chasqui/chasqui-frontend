(function() {
	'use strict';
    
    angular.module('chasqui').controller('ElementWrapperCtrl', ElementWrapperCtrl);
    
	function ElementWrapperCtrl($scope, contextPurchaseService, contextCatalogObserver, contextCatalogsService, catalogSupportStrategies, catalogNotSupportStrategies) {
        
        $scope.showElement = false;

        function validateProp() {
          contextCatalogsService.getCatalogs().then(function(){
            contextPurchaseService.getSelectedCatalog().then(function(catalog){
              if(catalog != undefined){
                $scope.showElement = catalogSupportStrategies(catalog, $scope.supportedStrategies) ||
                                     catalogNotSupportStrategies(catalog, $scope.notSupportedStrategies);
              }
            });
        });
        }
        
        function init(){
            if($scope.supportedStrategies == undefined) {
              $scope.supportedStrategies = "";
            }
            if($scope.notSupportedStrategies == undefined) {
              $scope.notSupportedStrategies = "";
            }

            validateProp();
          
            contextCatalogObserver.observe(function() {
              validateProp();
            });
        }
        
        init();
    }
    
})();