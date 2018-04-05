(function() {
	'use strict';

	angular
		.module('chasqui')
		.service('AddProductService', AddProductService);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function AddProductService(contextPurchaseService, AddProductPersonalOrderService, ModifyVarietyCount) {

        return addProduct;
        
        
        function addProduct(variety) {
			if (contextPurchaseService.isGrupoIndividualSelected()) {
                console.log("Agregar producto al pedido individual:", variety);
				AddProductPersonalOrderService(variety); // es individual
			} else {
				ModifyVarietyCount.modifyDialog(variety);
			}
		}
        
        
        
	}
})();