(function() {
	'use strict';

	angular
		.module('chasqui')
		.service('addProductService', addProductService);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function addProductService($log, contextPurchaseService, addProductPersonalOrderService, modifyVarietyCount, agrupationTypeDispatcher) {

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
                        modifyVarietyCount.modifyDialog(variety, selectedOrder);
                    },
                    function(node){
                        // TODO define behavior
                    });   
                })
            })
		}
	}
})();