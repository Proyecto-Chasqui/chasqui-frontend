(function() {
  'use strict';

  angular.module('chasqui').controller('HistorialGCCController', HistorialGCCController);

  
  function HistorialGCCController($log, $scope, $state, gccService, contextCatalogObserver, dialogCommons, $rootScope) {

    $scope.pedidosFiltrados = [];
    $scope.states = ["Confirmado", "Preparado", "Enviado"];
    $scope.classForItem = classForItem;
    $scope.direccionDeEntrega = direccionDeEntrega;
    $scope.viewOrderDetail = dialogCommons.viewOrderDetail;
    $scope.adaptOrder = adaptOrder;
      
    function getOrdersWithStates(states){
        contextCatalogObserver.observe(function(){

            function doOk(response) {
                $scope.pedidosFiltrados = response.data;
                $scope.pedidosFiltrados.reverse();
                $log.debug($scope.pedidosFiltrados);
            }

            gccService.pedidosColectivosConEstado($scope.group.idGrupo, states).then(doOk);
        })
    }     
      
    function direccionDeEntrega(pedido){
      if(pedido.direccion != null){
        return formatDireccion(pedido.direccion) +" ("+pedido.direccion.alias + ")";
      }
      if(pedido.puntoDeRetiro != null){
        return formatDireccion(pedido.puntoDeRetiro.direccion) +" ("+pedido.puntoDeRetiro.nombre + ")";
      }
      return "";
    }
      
    function formatDireccion(direccion){
      return direccion.calle +" "+ direccion.altura +", "+ direccion.localidad;
    }
    
    function classForItem(i){
      return i%2 == 0? "par" : "impar";
    }
      
    function mapToBEStates(state){
      var capState = state.toUpperCase();
      if(capState == "ENVIADO"){
        return "ENTREGADO";
      }else{
        return capState;
      }
    }
    
    function adaptOrder(order){
      order.idGrupo = $scope.group.idGrupo;
      return order;
    }
      
    /////////////////// INIT ////////////////////

    function init(){
        getOrdersWithStates($scope.states.map(mapToBEStates))
    }

    init();

    $rootScope.$on('group-is-loaded', function(event, group) {
        $scope.group = group;      
        init();
    });
    
  }

})();
