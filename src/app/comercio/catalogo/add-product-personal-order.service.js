(function() {
	'use strict';

	angular
		.module('chasqui')
		.service('AddProductPersonalOrderService', AddProductPersonalOrderService);

	/**
	 * Lista lateral de productos del pedido seleccionado
	 */
	function AddProductPersonalOrderService(contextPurchaseService, ModifyVarietyCount, REST_ROUTES, us, 
                                             productoService, $log, ToastCommons) {

        return agregarProductoIndividual;
        
        function agregarProductoIndividual(variety) {
		/** Si no tiene un pedido individual lo crea */
			if (contextPurchaseService.tienePedidoInividual()) {
				ModifyVarietyCount.modifyDialog(variety);
			} else {
                
                function actualizarPedidoIndividual() {
                    function doOkPedido(response) {
                        $log.debug("setPedidoYagregarProducto", response);
                        contextPurchaseService.setContextByOrder(response.data);
                        //contextPurchaseService.refresh();
                        ModifyVarietyCount.modifyDialog(variety);
                    }

                    productoService.verPedidoIndividual().then(doOkPedido);
                }
				// crear pedido y dialog
				function doNoOK(response) {
					if (us.contieneCadena(response.data.error, REST_ROUTES.ERROR_YA_TIENE_PEDIDO)) {
						ToastCommons.mensaje(us.translate('AGREAR_EN_PEDIDO_EXISTENTE'));
						ModifyVarietyCount.modifyDialog(variety);
					}
				}

				var json = {};
				json.idVendedor = contextPurchaseService.getCatalogContext();

				//si falla es poque ya tiene un pedido abierto TODO mejorar
				productoService.crearPedidoIndividual(json, doNoOK).then(actualizarPedidoIndividual)
			}

		}
        
        
        
        
	}
})();