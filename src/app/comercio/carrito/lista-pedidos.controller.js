(function() {
	'use strict';

	angular.module('chasqui').controller('ListaPedidosController',
		ListaPedidosController);

	/** @ngInject */
	function ListaPedidosController($log, $state, $scope, StateCommons, 
            productoService,ToastCommons, gccService, contextPurchaseService,us, promiseService, REST_ROUTES, 
            navigation_state, $rootScope, $stateParams, order_context, contextCatalogsService) {
        
		$log.debug('ListaPedidosController ..... ');
		navigation_state.goMyOrdersTab();

		$scope.orders = [];
		$scope.selected = null;
        $scope.previous = null;
		$scope.selectedIndex = 1;
		$scope.pedidosPorCategoria = null;




		$scope.$watch('listaPedidoCtrl.selectedIndex', function(current, old) {

			$scope.previous = $scope.selected;
			$scope.selected = $scope.orders[current];

			if (old + 1 && (old != current))
				if (!angular.isUndefined($scope.previous)) {
					$log.debug('Goodbye ' + $scope.previous.nombre + '!');
				}
			if (current + 1)
				if (!angular.isUndefined($scope.selected)) {
					$log.debug('Hello ' + $scope.selected.nombre + '!');
				}
		});

		function load() {
            contextCatalogsService.getCatalogs().then(function(catalogs){
                contextPurchaseService.getOrders().then(function(orders){
                    contextPurchaseService.getSelectedOrder().then(function(selectedOrder){
                        $scope.orders = orders.filter(function(o){return o.estado === "ABIERTO"});
                        setTabSeleccionado(selectedOrder);
                    })
                })
            })
            //$scope.fitrarPorEstadoConfirmado();
		}
        
        function setTabSeleccionado(tabSelected) {
			$scope.selectedIndex = $scope.orders.map(function(o){return o.id}).indexOf(tabSelected)
            $scope.selectedIndex = ($scope.selectedIndex === -1)?0:$scope.selectedIndex;
            console.log("Tab selected:", tabSelected, "Index: ", $scope.selectedIndex);
			$scope.selected = $scope.orders[$scope.selectedIndex];
		}
        
        $scope.isPersonal = function(order){
            return order.idGrupo === 0; 
        }

        $scope.isCollective = function(order){
            console.log("Order: ", order.id, !$scope.isPersonal(order));
            return !$scope.isPersonal(order);
        }

		// Last modification: 12-9-17

        $scope.fitrarPorEstadoConfirmado = function(){
            var params = {};
            params.idVendedor = contextPurchaseService.getCatalogContext();
            params.estados = ["CONFIRMADO"];
            
            promiseService.doPost(REST_ROUTES.filtrarPedidosConEstado, params).then(
                function doOk(response) {
                    console.log("Entre en el Dook", response);
                    $scope.pedidosPorCategoria = response.data.reverse()[0];
                    console.log($scope.pedidosPorCategoria);    
                }
            );
        } 
        

        $rootScope.$on('lista-producto-agrego-producto', function(event) {
            $log.debug("on lista-producto-agrego-producto");
            load();
        });


		load();
}
})();
