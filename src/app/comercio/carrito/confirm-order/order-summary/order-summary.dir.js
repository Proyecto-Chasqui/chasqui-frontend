(function() {
	'use strict';
    
    angular.module('chasqui').directive('orderSummary', orderSummary);
    
	function orderSummary() {
    
        return {
            restrict: 'E',
            scope: { 
                order: "=",
                next: "=",
                cancel: "="
            },
            controller: 'OrderSummaryController',
            templateUrl: 'app/comercio/carrito/confirm-order/order-summary/order-summary.tmpl.html'
          };
    }
    
})();         