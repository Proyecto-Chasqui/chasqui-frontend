(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ContextoPedidoController', ContextoPedidoController);

   /*
    *  FAB Button de contexto de compra.
    */
    function ContextoPedidoController($rootScope, $log, URLS, REST_ROUTES, $scope, gccService, us, 
                                     productoService, $timeout, contextPurchaseService,
                                     usuario_dao, modifyVarietyCount, contextOrdersService) {

        $log.debug("ContextoPedidoController .....");


        /////////////////////////////////////////////////
        
        $scope.urlBase = URLS.be_base;
        $scope.isLogued = usuario_dao.isLogged();
        $scope.pedidoSelected = {};
        $scope.showOrderResume = false;
        $scope.modifyVarietyCount = modifyVarietyCount.modifyDialog;
        
        ////////////////////////// Implementation

        function load() {
            console.log("Loading");
            contextOrdersService.ensureOrders(contextPurchaseService.getCatalogContext(), contextPurchaseService.getAgrupationContextType())
                .then(function(){
                    $scope.pedidoSelected = contextPurchaseService.getSelectedOrder();
                    $scope.showOrderResume = $scope.pedidoSelected.productosResponse.length > 0 && $scope.pedidoSelected.estado === 'ABIERTO';
            });
        }


        $rootScope.$on('contexto.compra.cambia.grupo', function(event, grupo) {
            load();
        });

        //actualiza la lista de productos
        $rootScope.$on('lista-producto-agrego-producto', function(event) {
            load();
        });

        load();

    }
    
})();