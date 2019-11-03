(function() {
	'use strict';

	angular
		.module('chasqui')
		.service('addProductService', addProductService);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
  function addProductService($log, contextPurchaseService, addProductPersonalOrderService, modifyVarietyCount, 
                              agrupationTypeDispatcher, $mdDialog, dialogCommons) {

    return addProduct;
    
    ///////////////////////////////////////////////////////////////////////////////
    
    function addProduct(variety){
        $log.debug("Agregar producto al pedido individual:", variety);
        contextPurchaseService.getSelectedAgrupation().then(function(selectedAgrupation){
            contextPurchaseService.getSelectedOrder().then(function(selectedOrder){
                agrupationTypeDispatcher.byElem(selectedAgrupation, 
                function(personal){
                    addProductPersonalOrderService(variety);
                },
                function(group){
                  if(selectedOrder.estado == 'CONFIRMADO'){
                    rememberConfirm(selectedOrder, "grupo");
                  }else{
                    modifyVarietyCount.modifyDialog(variety, selectedOrder);
                  }
                },
                function(node){
                  if(selectedOrder.estado == 'CONFIRMADO'){
                    rememberConfirm(selectedOrder, "nodo");
                  }else{
                    modifyVarietyCount.modifyDialog(variety, selectedOrder);
                  }
                });   
            })
        })
    }
    


    /////// GCC order confirm
  
    function rememberConfirm(order, label) {
      dialogCommons.acceptIssue("Su pedido individual dentro del "+label+" está confirmado", 
                            "Cuando el/la administrador/a del "+label+" "+ order.aliasGrupo +" confirme el pedido grupal actual se va a abrir un nuevo pedido grupal.", 
                            "Gracias por recordármelo!",
                            $mdDialog.hide, 
                            $mdDialog.hide);
    }

    function ignoreAction(){
      $mdDialog.hide();
    }
	}
})();