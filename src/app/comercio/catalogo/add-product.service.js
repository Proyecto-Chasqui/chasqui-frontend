(function() {
	'use strict';

	angular
		.module('chasqui')
		.service('addProductService', addProductService);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function addProductService(contextPurchaseService, addProductPersonalOrderService, modifyVarietyCount, agrupationTypeDispatcher) {

        return addProduct;
        
        ///////////////////////////////////////////////////////////////////////////////
        
        function addProduct(variety) {
            agrupationTypeDispatcher.byElem(contextPurchaseService.getSelectedAgrupation(), 
                function(personal){
                    console.log("Agregar producto al pedido individual:", variety);
                    addProductPersonalOrderService(variety);
                },
                function(group){
                    modifyVarietyCount.modifyDialog(variety);
                },
                function(node){
                    // TODO define behavior
                });
		}
	}
})();