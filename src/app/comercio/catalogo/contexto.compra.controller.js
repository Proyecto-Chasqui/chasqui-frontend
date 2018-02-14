(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ContextoCompraController', ContextoCompraController);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function ContextoCompraController($rootScope, $log, $scope, contextPurchaseService, 
                                       usuario_dao, contextAgrupationsService) {

		$log.debug("ContextoCompraController ..... ");

        $scope.isLogued = usuario_dao.isLogged();
        $scope.grupos = [];
        $scope.grupoSelected = {};
        
        function init(){
            contextAgrupationsService.getAgrupations().then(
                function(groups) {
                    $scope.grupos = groups.getGroups();
                    $scope.grupoSelected = contextPurchaseService.getGroupSelected().idGrupo;     
                    console.log("Grupos: ", $scope.grupos, "Selected id: ", contextPurchaseService.getGroupSelected().idGrupo);
                });
        }
        
        init();
        

		$scope.cambiarContexto = function() {
			contextPurchaseService.setContextoByGrupo(parseInt($scope.grupoSelected));
			$rootScope.$emit('contexto.compra.cambia.grupo', $scope.grupoSelected);
		}



	}
})();
