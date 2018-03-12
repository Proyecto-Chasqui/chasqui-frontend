(function() {
	'use strict';
    
    angular.module('chasqui').controller('ElementWrapperCtrl', ElementWrapperCtrl);
    
	function ElementWrapperCtrl($scope, contextPurchaseService, catalogSupportStrategies) {
        
        $scope.showElement = catalogSupportStrategies(contextPurchaseService.getSelectedCatalog(), $scope.supportedStrategies);
        
    }
    
})();