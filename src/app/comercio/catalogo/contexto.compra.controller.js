(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('ContextoCompraController', ContextoCompraController);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function ContextoCompraController($rootScope, $log, $scope, contextoCompraService, 
                                       usuario_dao) {

		$log.debug("ContextoCompraController ..... ");

        $scope.isLogued = usuario_dao.isLogged();
        $scope.grupos = [];
        $scope.grupoSelected = {};
        
        function init(){
            contextoCompraService.getGrupos().then(
                function(groups) {
                    $scope.grupos = groups.getGroups();
                    $scope.grupoSelected = contextoCompraService.getGroupSelected().idGrupo;     
                    console.log("Grupos: ", $scope.grupos, "Selected id: ", contextoCompraService.getGroupSelected().idGrupo);
                });
        }
        
        init();
        

		$scope.cambiarContexto = function() {
			contextoCompraService.setContextoByGrupo(parseInt($scope.grupoSelected));
			$rootScope.$emit('contexto.compra.cambia.grupo', $scope.grupoSelected);
		}



	}
})();
