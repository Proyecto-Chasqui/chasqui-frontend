(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ContextoCompraController', ContextoCompraController);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function ContextoCompraController($rootScope, $log, $scope, contextPurchaseService, 
                                       usuario_dao, contextAgrupationsService, order_context) {

		$log.debug("ContextoCompraController ..... ");

        $scope.isLogued = usuario_dao.isLogged();
        $scope.grupos = [];
        $scope.grupoSelected = {};
        
        function init(){
            contextAgrupationsService.getAgrupations(order_context.getCatalogId().toString()).then(
                function(groups) {
                    $scope.grupos = groups.getGroups();
                    $scope.grupoSelected = contextPurchaseService.getAgrupationContextId();     
                    console.log("Grupos: ", $scope.grupos, "Selected id: ", contextPurchaseService.getAgrupationContextId());
                });
        }
        
        init();
        

		$scope.cambiarContexto = function() {
            console.log("Cambiar de contexto", $scope.grupoSelected);
			contextPurchaseService.setContextByAgrupation({id: contextAgrupationsService.getAgrupation($scope.grupoSelected)});
			$rootScope.$emit('contexto.compra.cambia.grupo', $scope.grupoSelected);
		}



	}
})();
