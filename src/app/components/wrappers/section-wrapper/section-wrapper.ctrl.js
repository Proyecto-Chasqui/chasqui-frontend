(function() {
	'use strict';
    
    angular.module('chasqui').controller('SectionWrapperCtrl', SectionWrapperCtrl);
    
	function SectionWrapperCtrl($scope, contextPurchaseService, catalogSupportStrategies) {
        
        $scope.showElement = false;
        
        function init(){
            contextPurchaseService.getSelectedCatalog().then(function(catalog){
                $scope.showElement = catalogSupportStrategies(catalog, $scope.supportedStrategies);
            });
        }
        
        init();        
    }
    
})();