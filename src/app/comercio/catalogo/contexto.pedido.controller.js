(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ContextoPedidoController', ContextoPedidoController);

  /**
   *  FAB Button de contexto de compra.
   */
  function ContextoPedidoController($rootScope, $log, CTE_REST, $scope, gccService, us, 
                                     productoService, $timeout, contextoCompraService, 
                                     usuario_dao) {

    $log.debug("ContextoPedidoController .....");


    /////////////////////////////////////////////////o
    $scope.urlBase = CTE_REST.url_base;
    $scope.isLogued = usuario_dao.isLogged();

    function load() {
        console.log("Load");
        contextoCompraService.getPedidos().then(
            function(orders) {
                $scope.pedidoSelected = contextoCompraService.getOrderSelected();
                //console.log("Pedido: ", $scope.pedidoSelected.id);
        });
    }
      
      
    $rootScope.$on('contexto.compra.cambia.grupo',
      function(event, grupo) {
        $log.debug("on contexto.compra.cambia.grupo");			
        load();
      });

    //actualiza la lista de productos
    $rootScope.$on('lista-producto-agrego-producto',
      function(event) {
        $log.debug("on lista-producto-agrego-producto");
        load();
      });

    load();
  }
})();
