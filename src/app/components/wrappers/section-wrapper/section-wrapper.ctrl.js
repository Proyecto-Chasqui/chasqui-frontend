(function() {
	'use strict';
    
    angular.module('chasqui').controller('SectionWrapperCtrl', SectionWrapperCtrl);
    
  function SectionWrapperCtrl($scope, contextPurchaseService, catalogSupportStrategies, 
    contextCatalogsService, catalogNotSupportStrategies, contextCatalogObserver) {
        
        $scope.showElement = false;
        
        function init(){
            if($scope.supportedStrategies == undefined) {
              $scope.supportedStrategies = "";
            }
            if($scope.notSupportedStrategies == undefined) {
              $scope.notSupportedStrategies = "";
            }
          
            contextCatalogObserver.observe(function(){
              contextCatalogsService.getCatalogs().then(function(catalogs){
                contextPurchaseService.getSelectedCatalog().then(function(catalog){
                  if(catalog != undefined){
                    $scope.showElement = catalogSupportStrategies(catalog, $scope.supportedStrategies) ||
                                          catalogNotSupportStrategies(catalog, $scope.notSupportedStrategies);
                  }
                });
              });
            });
        }
        
        init();        
    }
    
})();