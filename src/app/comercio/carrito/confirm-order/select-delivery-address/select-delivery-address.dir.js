(function() {
	'use strict';
    
    angular.module('chasqui').directive('selectDeliveryAddress', selectDeliveryAddress);
    
	function selectDeliveryAddress() {
    
        return {
            restrict: 'E',
            scope: {
                showGoProfile: "=",
                okAction: '='
            },
            controller: 'SelectDeliveryAddressController',
            templateUrl: 'app/comercio/carrito/confirm-order/select-delivery-address/select-delivery-address.tmpl.html'
          };
    }
    
})();         