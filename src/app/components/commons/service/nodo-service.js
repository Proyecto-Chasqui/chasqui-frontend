(function(){
	'use strict';

	angular.module('chasqui').service('nodoService', nodoService);

    // TODO Ver si estas dependencias son correctas, seguro alguna esta de mas
	function nodoService($log, REST_ROUTES, StateCommons, promiseService, ToastCommons, 
                         $stateParams, contextCatalogsService, setPromise){
		
        var nodoServiceInt = {
            crearPedidoGrupal: crearPedidoGrupal, // TODO borrar, esta de ejemplo nomas
            solicitarCrearNodo: solicitarCrearNodo,
               
        };

        // TODO borrar, esta de ejemplo nomas
        function crearPedidoGrupal(params, doNoOK){
			$log.debug(" service crearPedidoGrupal ");
			return promiseService.doPost(REST_ROUTES.crearPedidoGrupal, params, doNoOK);
		}
        
        function solicitarCrearNodo(params, doNoOK){
			$log.debug(" service solicitarCrearNodo ");
			return promiseService.doPost(REST_ROUTES.altaDeNodo, params, doNoOK);
		}
        
    return nodoServiceInt;
    }
})();
