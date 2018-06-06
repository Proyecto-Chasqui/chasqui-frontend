(function() {
	'use strict';
    
    angular.module('chasqui').directive('orderSummary', orderSummary);
    
	function orderSummary() {
    
        return {
            restrict: 'E',
            scope: {
                order: "=",
                selectedAddress: "="
            },
            controller: 'OrderSummaryController',
            templateUrl: 'app/comercio/carrito/order-summary/order-summary.tmpl.html'
          };
    }
    
})();         