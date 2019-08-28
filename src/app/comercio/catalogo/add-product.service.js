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
                    rememberConfirm(selectedOrder)
                  }else{
                    modifyVarietyCount.modifyDialog(variety, selectedOrder);
                  }
                },
                function(node){
                    // TODO define behavior
                });   
            })
        })
    }
    


    /////// GCC order confirm
  
    function rememberConfirm(order) {
      dialogCommons.acceptIssue("Su pedido individual dentro del grupo está confirmado", 
                            "Cuando el/la administrador/a del grupo "+ order.aliasGrupo +" confirme el pedido grupal actual se va a abrir un nuevo pedido grupal.", 
                            "Gracias por recordármelo!",
                            $mdDialog.hide, 
                            $mdDialog.hide);
    }

    function ignoreAction(){
      $mdDialog.hide();
    }
	}
})();