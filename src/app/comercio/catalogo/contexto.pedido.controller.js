(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ContextoPedidoController', ContextoPedidoController);

   /*
    *  FAB Button de contexto de compra.
    */
    function ContextoPedidoController($rootScope, $log, URLS, REST_ROUTES, $scope, gccService, us, contextCatalogObserver,
                                     productoService, $timeout, contextPurchaseService, contextCatalogsService, toastr,
                                     usuario_dao, modifyVarietyCount, contextOrdersService, confirmOrder, dialogCommons) {

        $log.debug("ContextoPedidoController .....");


        /////////////////////////////////////////////////
        
        $scope.urlBase = URLS.be_base;
        $scope.isLogued = usuario_dao.isLogged();
        $scope.pedidoSelected = {};
        $scope.showOrderResume = false;
        $scope.modifyVarietyCount = modifyVarietyCount.modifyDialog;
        $scope.confirmOrder = confirmOrder;
        $scope.cancelOrder = cancelOrder;
              
      
        /////////////////////////////////////////////////
      
        function cancelOrder(order){
            dialogCommons.confirm("¿Cancelar pedido?", 
                                  "¿Está seguro que quiere cancelarlo?", 
                                  "Si", 
                                  "No", 
                                  doCancelOrder(order), 
                                  ignoreAction);
        }


        function doCancelOrder(order){
            return function(){
                $log.debug('DetallePedidoController , cancelar', order);

                function doOk(response) {
                    $log.debug("--- cancelar pedido response ", response.data);
                    toastr.info(us.translate('CANCELADO'), us.translate('AVISO_TOAST_TITLE'));
                    contextOrdersService.setStateCancel(contextPurchaseService.getCatalogContext(), order);
                    if(order.type == "PERSONAL"){
                        contextOrdersService.setVirtualPersonalOrder(contextPurchaseService.getCatalogContext());
                    }
                    load();
                }

                productoService.cancelarPedidoIndividual(order.id).then(doOk);
            }
        }

        function ignoreAction(){
            $mdDialog.hide();
        }
      
      
        //////////////// Init 
        function load() {
            contextCatalogObserver.observe(function(){
                $log.debug("Loading", contextPurchaseService.getAgrupationContextType());
                if(contextPurchaseService.getAgrupationContextType()){
                  contextOrdersService.ensureOrders(contextPurchaseService.getCatalogContext(), contextPurchaseService.getAgrupationContextType()).then(function(){
                      contextPurchaseService.getSelectedOrder().then(function(selectedOrder){
                        $scope.pedidoSelected = selectedOrder;
                        $scope.pedidoSelected.productosResponse = $scope.pedidoSelected.productosResponse.reverse();
                        $scope.showOrderResume = $scope.pedidoSelected.productosResponse.length > 0 
                                                && $scope.pedidoSelected.estado != 'VENCIDO' 
                                                && $scope.pedidoSelected.estado != 'CANCELADO';
                      })
                  });
                }
            })
        }


        $rootScope.$on('contexto.compra.cambia.grupo', function(event, grupo) {
            load();
        });

        //actualiza la lista de productos
        $rootScope.$on('lista-producto-agrego-producto', function(event) {
            load();
        });
      
        $rootScope.$on('order-confirmed', function(event) {
            load();
        });
      
        $rootScope.$on('order-cancelled', function(event) {
            load();
        });

        load();

    }
    
})();