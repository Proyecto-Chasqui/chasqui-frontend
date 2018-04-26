(function() {
	'use strict';
    
    angular.module('chasqui').controller('SectionWrapperCtrl', SectionWrapperCtrl);
    
	function SectionWrapperCtrl($scope, contextPurchaseService, catalogSupportStrategies, contextCatalogsService) {
        
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