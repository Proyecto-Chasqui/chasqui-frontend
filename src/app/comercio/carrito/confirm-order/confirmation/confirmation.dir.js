(function() {
	'use strict';
    
    angular.module('chasqui').directive('confirmation', confirmation);
    
	function confirmation() {
    
        return {
            restrict: 'E',
            scope: {
                order: "=",
                selectedAddress: "=",
                next: "=",
                cancel: "=",
            },
            controller: 'ConfirmationController',
            templateUrl: 'app/comercio/carrito/confirm-order/confirmation/confirmation.tmpl.html'
          };
    }
    
})();         