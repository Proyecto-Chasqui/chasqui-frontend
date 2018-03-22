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
        $scope.cambiarContexto = cambiarContexto;
        $scope.showSelector = showSelector;
        
        function init(){
            $scope.grupoSelected = contextPurchaseService.getAgrupationContextId();
            contextPurchaseService.getAgrupations().then(function(agrupationsInt) {
                    $scope.grupos = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), 
                                                                        agrupationTypeVAL.TYPE_GROUP);
                });
        }
        
        init();
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function cambiarContexto() {
            contextPurchaseService.setContextByAgrupation($scope.grupos.filter(function(g){return g.idGrupo === parseInt($scope.grupoSelected)})[0]);
			$rootScope.$emit('contexto.compra.cambia.grupo', $scope.grupoSelected.id);
		}

        function showSelector(){
            return $scope.grupos.length > 0;
        }
        

	}
})();
