(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ContextoPedidoController', ContextoPedidoController);

  /**
   *  FAB Button de contexto de compra.
   */
  function ContextoPedidoController($rootScope, $log, URLS, REST_ROUTES, $scope, gccService, us, 
                                     productoService, $timeout, contextPurchaseService, 
                                     usuario_dao, modifyVarietyCount) {

        $log.debug("ContextoPedidoController .....");


        /////////////////////////////////////////////////o
        $scope.urlBase = URLS.be_base;
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
              modifyVarietyCount.modifyDialog(variety);
        }

    }
    
})();