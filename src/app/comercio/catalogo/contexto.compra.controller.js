(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ContextoCompraController', ContextoCompraController);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function ContextoCompraController($rootScope, $log, $scope, contextPurchaseService, agrupationTypeVAL,
                                       usuario_dao, contextAgrupationsService, order_context) {

		$log.debug("ContextoCompraController ..... ");

        $scope.isLogued = usuario_dao.isLogged();
        $scope.grupos = [];
        $scope.grupoSelected = {};
        
        function init(){
            contextPurchaseService.getAgrupations().then(
                function(agrupationsInt) {
                    $scope.grupos = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), 
                                                                        agrupationTypeVAL.TYPE_GROUP);
                    $scope.grupoSelected = contextPurchaseService.getSelectedAgrupation();     
                });
        }
        
        init();
        

		$scope.cambiarContexto = function() {
            console.log("Cambiar de contexto", $scope.grupoSelected);
            // TODO Mejorar esto
			contextPurchaseService.setContextByAgrupation($scope.grupoSelected);
			$rootScope.$emit('contexto.compra.cambia.grupo', $scope.grupoSelected.id);
		}



	}
})();
