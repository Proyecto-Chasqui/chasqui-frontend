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
    $scope.pedidosFiltrados = [];
    $scope.getAliasGrupo = getAliasGrupo;
    $scope.viewOrderDetail = viewOrderDetail;
    $scope.states = ["Confirmado", "Preparado", "Enviado"];
    $scope.selectedState = "";
    $scope.getOrdersWithState = getOrdersWithState;
    $scope.classForItem = classForItem;
    $scope.descripcionDelEstado = descripcionDelEstado;
    $scope.direccionDeEntrega = direccionDeEntrega;

    
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
                estados: [mapToBEStates(state)]
            };

            function doOk(response) {
                $scope.pedidosFiltrados = response.data;
                $scope.pedidosFiltrados.reverse();
                console.log($scope.pedidosFiltrados);    
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
    
    function classForItem(i){
      return i%2 == 0? "par" : "impar";
    }
    
    
    function descripcionDelEstado(estado){
      switch(estado){
        case "Confirmado":
          return "Los pedidos confirmados son los últimos pedidos que le hiciste a la comercializadora."
        case "Preparado":
          return "Los pedidos preparados son los que la comercializadora ya tiene listos para entregar."
        case "Enviado":
          return "Los pedidos enviados son los que estan en camino o ya fueron entegados en la dirección."
      }
    }
    
    function mapToBEStates(state){
      var capState = state.toUpperCase();
      if(capState == "ENVIADO"){
        return "ENTREGADO";
      }else{
        return capState;
      }
    }
    
    function direccionDeEntrega(pedido){
      if(pedido.direccion != null){
        return formatDireccion(pedido.direccion) +" ("+pedido.direccion.alias + ")";
      }
      if(pedido.puntoDeRetiro != null){
        return formatDireccion(pedido.puntoDeRetiro.direccion) +" ("+pedido.puntoDeRetiro.nombre + ")";
      }
      return "placeholder 1234, Bernal (UNQ)";
    }
    
    
    function formatDireccion(direccion){
      return direccion.calle +" "+ direccion.altura +", "+ direccion.localidad;
    }
    
    ///////////////////////////////////
    
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
