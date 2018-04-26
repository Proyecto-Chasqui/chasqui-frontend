(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ContextoCompraController', ContextoCompraController);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function ContextoCompraController($rootScope, $log, $scope, contextPurchaseService, agrupationTypeVAL,
                                       usuario_dao, contextAgrupationsService, order_context, contextCatalogObserver) {

		$log.debug("ContextoCompraController ..... ");

        $scope.grupos = [];
        $scope.agrupationSelected = {};
        $scope.cambiarContexto = cambiarContexto;
        $scope.showSelector = showSelector;
        $scope.setGroupAsAgrupationSelected = setGroupAsAgrupationSelected;
        $scope.setPersonalAsAgrupationSelected = setPersonalAsAgrupationSelected;
        
        function init(){
            contextCatalogObserver.observe(function(){
                $scope.agrupationSelected = {
                    id: contextPurchaseService.getAgrupationContextId(),
                    type: agrupationTypeVAL.TYPE_GROUP
                }
                contextPurchaseService.getAgrupations().then(function(agrupationsInt) {
                        $scope.grupos = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), 
                                                                            agrupationTypeVAL.TYPE_GROUP);
                    });
            })
        }
        
        init();
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function cambiarContexto() {
            console.log("Cambio de contexto:", $scope.agrupationSelected);
            contextPurchaseService.setContextByAgrupation($scope.agrupationSelected);
			$rootScope.$emit('contexto.compra.cambia.grupo', $scope.agrupationSelected);
		}

        function showSelector(){
            return $scope.grupos.length > 0;
        }
        
        function setGroupAsAgrupationSelected(){
            $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_GROUP;
        }
        
        function setPersonalAsAgrupationSelected(){
            $scope.agrupationSelected.type = agrupationTypeVAL.TYPE_PERSONAL;
        }

        
	}
})();
