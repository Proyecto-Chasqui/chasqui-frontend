(function() {
	'use strict';
    
    angular.module('chasqui').controller('DeliveryPointsCtrl', DeliveryPointsCtrl);
    
	function DeliveryPointsCtrl(navigation_state, $scope, deliveryPointsService, contextPurchaseService) {
        
        navigation_state.goDeliveryPointsTab();
        $scope.deliveryPoints = [];
        $scope.formatAddress = formatAddress;
        
        deliveryPointsService.deliveryPoints(contextPurchaseService.getSelectedCatalog().nombre).then(function(response){
            $scope.deliveryPoints = response.data;
        });    
        
        ///////////////////////////////
        
        function formatAddress(address){
            return address.calle + " " + address.altura;
        }
        
    }
    
})();