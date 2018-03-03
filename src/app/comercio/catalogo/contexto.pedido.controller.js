(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ContextoPedidoController', ContextoPedidoController);

  /**
   *  FAB Button de contexto de compra.
   */
  function ContextoPedidoController($rootScope, $log, CTE_REST, $scope, gccService, us, 
                                     productoService, $timeout, contextPurchaseService, 
                                     usuario_dao, ModifyVarietyCount, order_context) {

        $log.debug("ContextoPedidoController .....");


        /////////////////////////////////////////////////o
        $scope.urlBase = CTE_REST.url_base;
        $scope.isLogued = usuario_dao.isLogged();

      
        // TODO: creo que no corresponde esta recarga. Revisar
        function load() {
            console.log("Load");
            $scope.pedidoSelected = contextPurchaseService.getSelectedOrder();
        }


        $rootScope.$on('contexto.compra.cambia.grupo', function(event, grupo) {
            load();
        });

        //actualiza la lista de productos
        $rootScope.$on('lista-producto-agrego-producto', function(event) {
            load();
        });

        load();


        $scope.modifyVarietyCount = function(variety){
              ModifyVarietyCount.modifyDialog(variety);
        }

    }
    
})();