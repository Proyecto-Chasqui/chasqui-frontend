(function() {
	'use strict';

	angular.module('chasqui').controller('ListaPedidosController',
		ListaPedidosController);

	/** @ngInject */
	function ListaPedidosController($log, $state, $scope, StateCommons, 
            productoService,ToastCommons, gccService, contextPurchaseService,us, promiseService, REST_ROUTES, 
            navigation_state, $rootScope, $stateParams, order_context) {
        
		$log.debug('ListaPedidosController ..... ');
		navigation_state.goMyOrdersTab();
		var vm = this;
		$scope.habilita = false;

		$scope.orders = [];
		$scope.selected = null, $scope.previous = null;
		$scope.selectedIndex = 1;
		$scope.pedidosPorCategoria = null;




		$scope.$watch('listaPedidoCtrl.selectedIndex', function(current, old) {

			$scope.previous = $scope.selected;
			$scope.selected = $scope.orders[current];

			$log.debug('cambio tab ..... ', $scope.selected);

			if (old + 1 && (old != current))
				if (!angular.isUndefined($scope.previous)) {
					$log.debug('Goodbye ' + $scope.previous.nombre + '!');
				}
			if (current + 1)
				if (!angular.isUndefined($scope.selected)) {
					$log.debug('Hello ' + $scope.selected.nombre + '!');
				}
		});


		$scope.crearPedidoIndividual = function() {
			$log.debug("--- Crear pedido individual----");
			callCrearPedidoIndividual();
		}


		function setTabSeleccionado(tabSelected) {
			$scope.selectedIndex = $scope.orders.map(function(o){return o.id}).indexOf(tabSelected)
            $scope.selectedIndex = ($scope.selectedIndex === -1)?0:$scope.selectedIndex;
            console.log("Tab selected:", tabSelected, "Index: ", $scope.selectedIndex);
			$scope.selected = $scope.orders[$scope.selectedIndex];
		}
	
        
		function callCrearPedidoIndividual() {
			function doOk(response) {
				$log.debug("--- crear pedido individual response ", response.data);

				ToastCommons.mensaje(us.translate('PEDIDO_CREADO'));
				callPedidoIndividual();
			}
			var json = {};
			json.idVendedor = contextPurchaseService.getCatalogContext();

			productoService.crearPedidoIndividual(json).then(doOk)
		}
	

		function load() {
			contextPurchaseService.getOrders().then(function(orders) {
				$scope.orders = orders.getOrders(contextPurchaseService.getCatalogContext()).filter(function(o){return o.estado === "ABIERTO"});
				setTabSeleccionado(contextPurchaseService.getOrderContext());
			});
		}
        
        $scope.isPersonal = function(order){
            return order.idGrupo === 0; 
        }

        $scope.isCollective = function(order){
            console.log("Order: ", order.id, !$scope.isPersonal(order));
            return !$scope.isPersonal(order);
        }

		// Agregado por favio 12-9-17

        $scope.fitrarPorEstadoConfirmado = function(){
            console.log("HOOOOOOOOOOOOOOOOOOOOOOOOOla");
            var params = {};
            params.idVendedor = contextPurchaseService.getCatalogContext();
            params.estados = ["CONFIRMADO"];
            return promiseService.doPost(REST_ROUTES.filtrarPedidosConEstado, params).then(
                function doOk(response) {
                    console.log("Entre en el Dook", response);
                    $scope.pedidosPorCategoria = response.data.reverse()[0];
                    console.log($scope.pedidosPorCategoria);    
                }
            );
        } 
        $scope.fitrarPorEstadoConfirmado();

        $rootScope.$on('lista-producto-agrego-producto', function(event) {
            $log.debug("on lista-producto-agrego-producto");
            load();
        });


		load();
}
})();
