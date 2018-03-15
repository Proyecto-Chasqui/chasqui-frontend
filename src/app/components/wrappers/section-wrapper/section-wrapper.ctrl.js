(function() {
	'use strict';
    
    angular.module('chasqui').controller('SectionWrapperCtrl', SectionWrapperCtrl);
    
	function SectionWrapperCtrl($scope, contextPurchaseService, catalogSupportStrategies) {
        
        $scope.showElement = catalogSupportStrategies(contextPurchaseService.getSelectedCatalog(), $scope.supportedStrategies);
        
    }
    
})();