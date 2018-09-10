(function() {
  'use strict';

  angular.module('chasqui').controller('ListaPedidosController',
    ListaPedidosController);

  /** @ngInject */
  function ListaPedidosController($log, $state, $scope, StateCommons, contextCatalogObserver,
            productoService,ToastCommons, gccService, contextPurchaseService,us, promiseService, REST_ROUTES, 
            navigation_state, $rootScope, $stateParams, order_context, contextCatalogsService, dialogCommons) {
        
    $log.debug('ListaPedidosController ..... ');
    navigation_state.goMyOrdersTab();

    $scope.orders = [];
    $scope.selected = null;
    $scope.previous = null;
    $scope.selectedIndex = 1;
    $scope.pedidosConfirmados = [];
    $scope.getAliasGrupo = getAliasGrupo;
    $scope.viewOrderDetail = viewOrderDetail;
    $scope.states = ["CONFIRMADO", "PREPARADO", "ENTREGADO"];
    $scope.selectedState = "";
    $scope.getOrdersWithState = getOrdersWithState;
    $scope.classForItem = function(i){
      return i%2 == 0? "par" : "impar";
    }
    

    
    ////////////////////////// Init //////////////////////////
    
    function init() {
      $scope.selectedState = $scope.states[0];
      getOrdersWithState($scope.selectedState);
      contextCatalogObserver.observe(function(){
        
        /*contextCatalogsService.getCatalogs().then(function(catalogs){
          contextPurchaseService.getOrders().then(function(orders){
            contextPurchaseService.getSelectedOrder().then(function(selectedOrder){
              $scope.orders = orders.filter(function(o){return o.estado === "ABIERTO" && o.montoActual != 0});
              setTabSeleccionado(selectedOrder.id);
            })
          })
        })*/
      })
    }


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

        
    function setTabSeleccionado(tabSelected) {
        $scope.selectedIndex = $scope.orders.map(function(o){return o.id}).indexOf(tabSelected);
        $scope.selectedIndex = ($scope.selectedIndex === -1)? 0: $scope.selectedIndex;
        $scope.selected = $scope.orders[$scope.selectedIndex];
    }
        
    $scope.isPersonal = function(order){
        return order.idGrupo === 0; 
    }

    $scope.isCollective = function(order){
        console.log("Order: ", order.id, !$scope.isPersonal(order));
        return !$scope.isPersonal(order);
    }


    function getOrdersWithState(state){
        contextCatalogObserver.observe(function(){

            var params = {
                idVendedor: contextPurchaseService.getCatalogContext(),
                estados: [state]
            };

            function doOk(response) {
                $scope.pedidosConfirmados = response.data;
                $scope.pedidosConfirmados.reverse();
                console.log($scope.pedidosConfirmados);    
            }

            promiseService.doPost(REST_ROUTES.filtrarPedidosConEstado, params).then(doOk);
        })
    } 

    
    function getAliasGrupo(pedido){
      return pedido.aliasGrupo == null? "Personal": pedido.aliasGrupo;
    }

    function viewOrderDetail(order){
      dialogCommons.viewOrderDetail(order);
    }
    
    
    $rootScope.$on('lista-producto-agrego-producto', function(event) {
        $log.debug("on lista-producto-agrego-producto");
        init();
    });

    $rootScope.$on('order-confirmed', function(event) {
        $log.debug("on order-confirmed");
        init();
    });

    $rootScope.$on('order-cancelled', function(event) {
        $log.debug("on order-cancelled");
        init();
    });


    init();
    
}})();
