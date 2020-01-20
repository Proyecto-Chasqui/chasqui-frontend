(function() {
	'use strict';
    
    angular.module('chasqui').directive('selectDeliveryAddress', selectDeliveryAddress);
    
	function selectDeliveryAddress() {
    
        return {
            restrict: 'E',
            scope: {
                order: "=",
                showGoProfile: "=",
                okAction: '=',
                next: "=",
                cancel: "="
            },
            controller: 'SelectDeliveryAddressController',
            templateUrl: 'app/comercio/carrito/confirm-order/select-delivery-address/select-delivery-address.tmpl.html'
          };
    }
    
})();         