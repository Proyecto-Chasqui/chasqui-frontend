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

        $scope.grupos = [];
        $scope.grupoSelected = 0;
        
        function init(){
            $scope.grupoSelected = contextPurchaseService.getAgrupationContextId();
            contextPurchaseService.getAgrupations().then(function(agrupationsInt) {
                    $scope.grupos = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), 
                                                                        agrupationTypeVAL.TYPE_GROUP);
                });
        }
        
        init();
        

		$scope.cambiarContexto = function() {
            contextPurchaseService.setContextByAgrupation($scope.grupos.filter(function(g){return g.idGrupo === parseInt($scope.grupoSelected)})[0]);
			$rootScope.$emit('contexto.compra.cambia.grupo', $scope.grupoSelected.id);
		}



	}
})();
