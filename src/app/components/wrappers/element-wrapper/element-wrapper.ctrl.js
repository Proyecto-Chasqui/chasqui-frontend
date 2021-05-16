(function() {
	'use strict';
    
    angular.module('chasqui').controller('ElementWrapperCtrl', ElementWrapperCtrl);
    
	function ElementWrapperCtrl($scope, contextPurchaseService, contextCatalogsService, catalogSupportStrategies, catalogNotSupportStrategies) {
        
        $scope.showElement = false;
        
        function init(){
            if($scope.supportedStrategies == undefined) {
              $scope.supportedStrategies = "";
            }
            if($scope.notSupportedStrategies == undefined) {
              $scope.notSupportedStrategies = "";
            }
          
            contextCatalogsService.getCatalogs().then(function(){
                contextPurchaseService.getSelectedCatalog().then(function(catalog){
                  if(catalog != undefined){
                    $scope.showElement = catalogSupportStrategies(catalog, $scope.supportedStrategies) ||
                                         catalogNotSupportStrategies(catalog, $scope.notSupportedStrategies);
                  }
                });
            });
        }
        
        init();
    }
    
})();