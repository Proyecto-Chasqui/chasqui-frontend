(function() {
	'use strict';
    
    angular.module('chasqui').controller('DeliveryPointsCtrl', DeliveryPointsCtrl);
    
	function DeliveryPointsCtrl(navigation_state, $scope, contextCatalogObserver, deliveryPointsService, contextPurchaseService, $sce) {
        
        navigation_state.goDeliveryPointsTab();
        $scope.deliveryPoints = [];
        $scope.formatAddress = formatAddress;
        $scope.zonesMap = "";
        $scope.showMap = false;
        ///////////////////////////////
        function init(){
            contextCatalogObserver.observe(function(){
              contextPurchaseService.getSelectedCatalog().then(function(catalog){
                $scope.zonesMap = $sce.trustAsResourceUrl(catalog.urlMapa);
                $scope.showMap = $scope.zonesMap != ""; 
                  deliveryPointsService.deliveryPoints(catalog.nombreCorto).then(function(response){
                      $scope.deliveryPoints = response.data.puntosDeRetiro;

                  });    
              })
            });
        }
        
        ///////////////////////////////
        
        function formatAddress(address){
            return address.calle +" "+ address.altura +", "+ address.localidad;
        }
        
      
      
        init();
    }
    
})();