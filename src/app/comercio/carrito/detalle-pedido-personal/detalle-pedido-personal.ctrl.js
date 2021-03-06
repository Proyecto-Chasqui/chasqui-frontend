(function() {
  'use strict';

  angular.module('chasqui').controller('DetallePedidoPersonalController',
    DetallePedidoPersonalController);

  /** @ngInject */
  function DetallePedidoPersonalController($log, $state, $scope, URLS, REST_ROUTES, $rootScope,
                                              ToastCommons, toastr, $mdDialog, dialogCommons, contextOrdersService,
                                              productoService, perfilService, gccService,
                                          vendedorService, contextPurchaseService, us) {
    $log.debug('DetallePedidoController ..... ', $scope.pedido);
      
    $scope.confirmOrder = confirmOrder;
    $scope.cancelOrder = cancelOrder;
        
        
    ///////////////////////////////////////
        
    function confirmOrder() {  
      var actions = {
          doOk: doConfirmOrder,
          doNotOk: ignoreAction
      };
      
      // dialogCommons.selectDeliveryAddress(actions, $scope.pedido);

      $state.go('catalog.confirmOrder', { 
        actions: actions, 
        order: $scope.pedido
      });
    }
        
    function doConfirmOrder(selectedAddress, answers) {
        $log.debug('callConfirmar', $scope.pedido);

        function doOk(response) {
            toastr.success(us.translate('PEDIDO_CONFIRMADO_MSG'), us.translate('AVISO_TOAST_TITLE'));
            contextOrdersService.setStateConfirmed(contextPurchaseService.getCatalogContext(), $scope.pedido);
            contextOrdersService.setVirtualPersonalOrder(contextPurchaseService.getCatalogContext());
            $log.debug('callConfirmar notificacion');
            $rootScope.$emit('order-confirmed');
        }

        var params = {
                        idPedido: $scope.pedido.id,
                        idDireccion: "",
                        idPuntoDeRetiro: "",
                        idZona: "",
                        comentario: "",
                        opcionesSeleccionadas: answers.map(function(a){
                            return {
                                nombre: a.nombre,
                                opcionSeleccionada: a.answer
                            }
                        })
                    }

        productoService.confirmarPedidoIndividual(completeConfirmPersonalOrderParams(params, selectedAddress)).then(doOk);
    }
        

    function completeConfirmPersonalOrderParams(params, selectedAddress){
        return {
            address: function(){
                params.idDireccion = selectedAddress.selected.idDireccion;
                params.idZona = selectedAddress.zone.id;
                params.comentario = selectedAddress.particularities;
                return params;
            },
            deliveryPoint: function(){
                params.idPuntoDeRetiro = selectedAddress.selected.id;
                return params;
            }
        }[selectedAddress.type]();
    }


        /////////////////////////////////////////////
        
        
    function cancelOrder(){
        dialogCommons.confirm("¿Cancelar pedido?", 
                              "¿Está seguro que quiere cancelarlo?", 
                              "Si", 
                              "No", 
                              doCancelOrder, 
                              ignoreAction);
    }
        

    function doCancelOrder(){
      $log.debug('DetallePedidoController , cancelar', $scope.pedido);

      function doOk(response) {
          $log.debug("--- cancelar pedido response ", response.data);
          toastr.info(us.translate('CANCELADO'), us.translate('AVISO_TOAST_TITLE'));
          contextOrdersService.setStateCancel(contextPurchaseService.getCatalogContext(), $scope.pedido);
                  contextOrdersService.setVirtualPersonalOrder(contextPurchaseService.getCatalogContext());
          $log.debug('close');
          $mdDialog.hide();
          $rootScope.$emit('order-cancelled');
      }

      productoService.cancelarPedidoIndividual($scope.pedido.id).then(doOk);
    }
    
    function ignoreAction(){
        $mdDialog.hide();
    }
    
  }

})();
