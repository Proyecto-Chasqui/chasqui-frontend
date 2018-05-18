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
        
        function addProduct(variety){
            console.log("Agregar producto al pedido individual:", variety);
            contextPurchaseService.getSelectedAgrupation().then(function(selectedAgrupation){
                agrupationTypeDispatcher.byElem(selectedAgrupation, 
                function(personal){
                    addProductPersonalOrderService(variety);
                },
                function(group){
                    modifyVarietyCount.modifyDialog(variety);
                },
                function(node){
                    // TODO define behavior
                });   
            })
		}
	}
})();