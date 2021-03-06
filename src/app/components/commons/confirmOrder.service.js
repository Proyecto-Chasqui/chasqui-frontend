(function() {
	'use strict';

	angular.module('chasqui').service('confirmOrder', confirmOrder);

	function confirmOrder(dialogCommons, gccService, contextOrdersService, $rootScope, toastr, contextAgrupationsService,
                        $mdDialog, $log, productoService, us, contextPurchaseService, vendedorService, nodeService, $state) {
    
    function confirmOrderImpl(order){
      console.log(order);
        var confirm = {
          PERSONAL: confirmPersonalOrder,
          GROUP: confirmGCCOrder,
          NODE: confirmNodeOrder          
        }[order.type](order)
    }
    
    ////////////////////////
    
    /////// personal order confirm
    
    $rootScope.minPrice;

    function confirmPersonalOrder(order) {
        contextPurchaseService.getSelectedCatalog().then(function(selectedCatalog){
            if(selectedCatalog.few.seleccionDeDireccionDelUsuario 
               && !selectedCatalog.few.puntoDeEntrega 
               && order.aliasGrupo === "Individual"){
              
                priceValid(order.montoActual, function(isValid){
                  if(isValid){
                      showDialog(order);
                  }else{
                      warn();
                  }
                });
            }else{
                showDialog(order);
            }
        });

    }

    function priceValid(value, callback){
        vendedorService.obtenerConfiguracionVendedor().then(
            function(response){
                $rootScope.minPrice = response.data.montoMinimo;
                callback(value > $rootScope.minPrice);
            }
        );
    }

    function warn(){
        vendedorService.obtenerConfiguracionVendedor().then(
            function(response){
                var minPrice = response.data.montoMinimo;
                var msj = 'No puede confirmar su pedido debido a que no supera el monto mínimo de $' + String(minPrice);
                toastr.warning(msj, 'Aviso',{timeOut: 30000});
            }
        );
    }

    function showDialog(order){
      var actions = {
          doOk: doConfirmPersonalOrder(order),
          doNotOk: ignoreAction
      };
          
      // dialogCommons.selectDeliveryAddress(actions, order);
      
      $state.go('catalog.confirmOrder', { 
        actions: actions, 
        order: order
      });
    }
    
    
    function doConfirmPersonalOrder(order) {
        return function(selectedAddress, answers){
            $log.debug('callConfirmar', order);

            function doOk(response) {
                toastr.success(us.translate('PEDIDO_CONFIRMADO_MSG'), us.translate('AVISO_TOAST_TITLE'));
                contextOrdersService.setStateConfirmed(contextPurchaseService.getCatalogContext(), order);
                contextOrdersService.setVirtualPersonalOrder(contextPurchaseService.getCatalogContext());
                $rootScope.refrescarNotificacion();
                $rootScope.$emit('order-confirmed');
                $state.go('catalog.userOrders');
            }

            var params = {
                            idPedido: order.id,
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
      
    /////// GCC order confirm
      
    function confirmGCCOrder(order) {	
        dialogCommons.confirm("¿Confirmar el pedido?", 
                              "Una vez confirmado su pedido individual, tiene que esperar que el administrador del grupo lo confirme para que sea preparado y entregado.", 
                              "Confirmar", 
                              "No", 
                              doConfirmGCCOrder(order), 
                              ignoreAction);
		};
      
    function doConfirmGCCOrder(order){
        return function(){
            function doOk(response){
                toastr.success(us.translate('PEDIDO_CONFIRMADO_MSG'), us.translate('AVISO_TOAST_TITLE'));
                contextOrdersService.setStateConfirmed(contextPurchaseService.getCatalogContext(), order);
                $rootScope.$emit('order-confirmed');
                $rootScope.refrescarNotificacion();
                contextPurchaseService.getSelectedAgrupation().then(function(selectedAgrupation){
                  $log.debug("selectedAgrupation", selectedAgrupation);
                  contextAgrupationsService.confirmPersonalOrder(contextPurchaseService.getCatalogContext(), 
                                                                 selectedAgrupation.id, 
                                                                 selectedAgrupation.type, 
                                                                 order)
                  if(selectedAgrupation.esAdministrador){
                    dialogCommons.acceptIssue(
                      "Es administrador del grupo " + selectedAgrupation.alias, 
                      'Como administrador del grupo, no se olvide de confirmar el pedido grupal en la sección "Mis grupos"',
                      "Gracias por recordarmelo!", 
                      dialogCommons.askToCollaborate, //ok
                      dialogCommons.askToCollaborate  // no ok
                    );
                  }
                });
            }
            gccService.confirmarPedidoIndividualGcc(order.id).then(doOk);          
        }
    }
     
    
    //////// Node order confirm
    
    function confirmNodeOrder(order){
      dialogCommons.confirm("¿Confirmar el pedido?", 
                            "Una vez confirmado su pedido individual, tiene que esperar que el administrador del nodo lo confirme para que sea preparado y entregado.", 
                            "Confirmar", 
                            "No", 
                            doConfirmNodeOrder(order), 
                            ignoreAction);
    }

    function doConfirmNodeOrder(order){
      return function(){
        function doOk(response){
            toastr.success(us.translate('PEDIDO_CONFIRMADO_MSG'), us.translate('AVISO_TOAST_TITLE'));
            contextOrdersService.setStateConfirmed(contextPurchaseService.getCatalogContext(), order);
            $rootScope.$emit('order-confirmed');
            $rootScope.refrescarNotificacion();
            contextPurchaseService.getSelectedAgrupation().then(function(selectedAgrupation){
              $log.debug("selectedAgrupation", selectedAgrupation);
              contextAgrupationsService.confirmPersonalOrder(contextPurchaseService.getCatalogContext(), 
                                                             selectedAgrupation.id, 
                                                             selectedAgrupation.type, 
                                                             order)
              if(selectedAgrupation.esAdministrador){
                dialogCommons.acceptIssue(
                  "Es administrador del nodo " + selectedAgrupation.alias, 
                  'Como administrador del nodo, no se olvide de confirmar el pedido colectivo en la sección "Mis nodos"',
                  "Gracias por recordarmelo!", 
                  dialogCommons.askToCollaborate, //ok
                  dialogCommons.askToCollaborate  // no ok
                );
              }
            });
        }
        nodeService.confirmPersonalOrder(order.id).then(doOk);          
      }
    }
    
    /////// Common
    
    function ignoreAction(){
        $mdDialog.hide();
    }
    
    ////////////////////////
    return confirmOrderImpl;
	} 
})(); 