(function() {
	'use strict';

	angular
		.module('chasqui')
		.service('addProductPersonalOrderService', addProductPersonalOrderService);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function addProductPersonalOrderService(contextPurchaseService, modifyVarietyCount, REST_ROUTES, us, contextCatalogObserver,
                                             productoService, $log, ToastCommons, agrupationTypeVAL, contextOrdersService) {

        return agregarProductoIndividual;
        
        
        /////////////////// Public
        
        function agregarProductoIndividual(variety) { 
            contextCatalogObserver.observe(function(){
                contextOrdersService.ensureOrders(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_PERSONAL)
                    .then(function(){
                        var personalOrder = contextOrdersService.getOrdersByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_PERSONAL)[0];
                        contextPurchaseService.setContextByOrder(personalOrder);
                        modifyVarietyCount.modifyDialog(variety);
                        })
            })
		}
	}
})();