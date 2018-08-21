(function() {
	'use strict';

	angular.module('chasqui').service('confirmOrder', confirmOrder);

	function confirmOrder(dialogCommons, gccService, contextOrdersService, $rootScope, ToastCommons, 
                        $mdDialog, $log, productoService, us, contextPurchaseService) {
    
    function confirmOrderImpl(order){
        var confirm = {
          PERSONAL: confirmPersonalOrder,
          GROUP: confirmGCCOrder,
          NODE: confirmNodeOrder          
        }[order.type](order)
    }
    
    ////////////////////////
    
    /////// personal order confirm
    
    function confirmPersonalOrder(order) {  
            var actions = {
                doOk: doConfirmPersonalOrder(order),
                doNotOk: ignoreAction
            };
            
            dialogCommons.selectDeliveryAddress(actions, order);
    }
    
    
    function doConfirmPersonalOrder(order) {
        return function(selectedAddress, answers){
            $log.debug('callConfirmar', order);

            function doOk(response) {
                ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
                contextOrdersService.setStateConfirmed(contextPurchaseService.getCatalogContext(), order);
                contextOrdersService.setVirtualPersonalOrder(contextPurchaseService.getCatalogContext());
                $rootScope.$emit('order-confirmed');
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
                              doConfirmGCCOrder, 
                              ignoreAction);
		};
      
    function doConfirmGCCOrder(order){
        return function(){
            function doOk(response){
                ToastCommons.mensaje(us.translate('PEDIDO_CONFIRMADO_MSG'));
                contextOrdersService.setStateConfirmed(contextPurchaseService.getCatalogContext(), order);
                $rootScope.$emit('order-confirmed');
            }
            gccService.confirmarPedidoIndividualGcc(order.id).then(doOk);          
        }
    }
     
    
    //////// Node order confirm
    
    function confirmNodeOrder(){
      
    }
    
    /////// Common
    
    function ignoreAction(){
        $mdDialog.hide();
    }
    
    ////////////////////////
    return confirmOrderImpl;
	} 
})(); 