(function() {
	'use strict';
    
    angular.module('chasqui').controller('DeliveryPointsCtrl', DeliveryPointsCtrl);
    
	function DeliveryPointsCtrl(navigation_state, $scope, deliveryPointsService, contextPurchaseService) {
        
        navigation_state.goDeliveryPointsTab();
        $scope.deliveryPoints = [];
        $scope.formatAddress = formatAddress;
        
        ///////////////////////////////
        
        function init(){
            contextPurchaseService.getSelectedCatalog().then(function(catalog){
                deliveryPointsService.deliveryPoints(catalog.nombre).then(function(response){
                    $scope.deliveryPoints = response.data.puntosDeRetiro;
                });    
            })
        }
        
        ///////////////////////////////
        
        function formatAddress(address){
            return address.calle + " " + address.altura;
        }
        
        init();
    }
    
})();