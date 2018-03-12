(function() {
	'use strict';
    
    angular.module('chasqui').controller('StateWrapperCtrl', StateWrapperCtrl);
    
	function StateWrapperCtrl($scope, contextPurchaseService, catalogSupportStrategies) {
        
        $scope.showElement = catalogSupportStrategies(contextPurchaseService.getSelectedCatalog(), $scope.supportedStrategies);
        
    }
    
})();