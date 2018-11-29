(function() {
	'use strict';
    
    angular.module('chasqui').controller('SectionWrapperCtrl', SectionWrapperCtrl);
    
	function SectionWrapperCtrl($scope, contextPurchaseService, catalogSupportStrategies, contextCatalogsService, catalogNotSupportStrategies) {
        
        $scope.showElement = false;
        
        function init(){
            if($scope.supportedStrategies == undefined) {
              $scope.supportedStrategies = "";
            }
            if($scope.notSupportedStrategies == undefined) {
              $scope.notSupportedStrategies = "";
            }
          
            contextCatalogsService.getCatalogs().then(function(catalogs){
                contextPurchaseService.getSelectedCatalog().then(function(catalog){
                    $scope.showElement = catalogSupportStrategies(catalog, $scope.supportedStrategies) &&
                                         catalogNotSupportStrategies(catalog, $scope.notSupportedStrategies);
                });
            });
        }
        
        init();        
    }
    
})();