(function(){
	'use strict';

	angular.module('chasqui').service('nodeService', nodeService);

	function nodeService($log, REST_ROUTES, promiseService){
		
    const nodeServiceInt = {
      nodosAbiertos: nodosAbiertos,
      userRequests: userRequests,
      sendRequest: sendRequest,
      cancelRequest: cancelRequest,
      nodosTodos: nodosTodos,
      nuevoNodo: nuevoNodo,
      cerrar: cerrar,
      editar: editar,
      invitarUsuario: invitarUsuario,
      pedidosDeLosNodos: pedidosDeLosNodos
    };

		function nodosAbiertos(idCatalog, doNoOk){
			$log.debug(" service nodosAbiertos ");
			return promiseService.doGet(REST_ROUTES.nodosAbiertos(idCatalog), {},doNoOk);
    }
    
    function userRequests(idCatalog, doNoOk){
			$log.debug(" service userRequests ");
			return promiseService.doGetPrivate(REST_ROUTES.userRequests(idCatalog), {idVendedor: idCatalog}, doNoOk);
    }
    
    function sendRequest(idCatalog, idNodo, doNoOk){
			$log.debug(" service sendRequest ");
			return promiseService.doPost(REST_ROUTES.sendRequest, {idVendedor: idCatalog, idNodo: idNodo}, doNoOk);
    }    
    
    function cancelRequest(requestId, doNoOk){
			$log.debug(" service cancelRequest ");
			return promiseService.doPost(REST_ROUTES.cancelRequest(requestId), {idSolicitud: requestId}, doNoOk);
    }    

    cancelRequest
    
		function nodosTodos(idCatalog, doNoOk){
			$log.debug(" service nodosTodos ");
			return promiseService.doGetPrivate(REST_ROUTES.nodosTodos(idCatalog), {idVendedor: idCatalog}, doNoOk);
    }
    
    /*
      params = {
        "idVendedor" : 2,
        "nombreNodo" : "alias Grupo",
        "descripcion" : "descripcion",
        "idDomicilio" : 2,
        "tipoNodo" : "NODO_ABIERTO",
        "barrio" : "un barrio",
      }
    */
    function nuevoNodo(params, doNoOk){
			$log.debug(" service nodosTodos ");
			return promiseService.doPost(REST_ROUTES.nuevoNodo, params, doNoOk);
    }

    /* 
      params = {
        "idGrupo": 1,
        "idVendedor": 2
      }
    */
    function cerrar(params, doNoOk){
			$log.debug(" service cerrarNodo ");
			return promiseService.doPost(REST_ROUTES.cerrarNodo, params, doNoOk);
    }

    /* 
      params = {
        "idNodo": 1,
        "idVendedor": 2,
        "nombreNodo": "alias Grupo",
        "descripcion": "descripcion",
        "idDomicilio": 2,
        "tipoNodo": "NODO_ABIERTO",
        "idDireccion": 1,
        "barrio": "un barrio"
      }
    */
    function editar(params, doNoOk){
			$log.debug(" service editarNodo ");
			return promiseService.doPut(REST_ROUTES.editarNodo, params, doNoOk);
    }

    /* 
      {
        "idGrupo": 1,
        "emailInvitado": "email@dominio.com"
      }
    */
    function invitarUsuario(params){
			$log.debug(" service invitarUsuario ");
			return promiseService.doPost(REST_ROUTES.invitarUsuarioANodo, params);
		}

    function pedidosDeLosNodos(idVendedor, doNoOk){
			$log.debug(" service pedidosDeLosNodos ");
			return promiseService.doGetPrivate(REST_ROUTES.pedidosDeLosNodos(idVendedor), {}, doNoOk);
    }

		///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                
    return nodeServiceInt;
	}
})();
