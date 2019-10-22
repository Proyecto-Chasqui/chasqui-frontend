(function(){
	'use strict';

	angular.module('chasqui').service('nodeService', nodeService);

	function nodeService($log, REST_ROUTES, promiseService, 
                         $stateParams, contextCatalogsService, setPromise){
		
    const nodeServiceInt = {
      nodosTodos: nodosTodos,
      nuevoNodo: nuevoNodo,
      cerrarNodo: cerrarNodo,
      editar: editar,
      invitarUsuario: invitarUsuario,
    };

		function nodosTodos(idCatalog, doNoOk){
			$log.debug(" service nodosTodos ");
			return promiseService.doGetPrivate(REST_ROUTES.nodosTodos(idCatalog), {idCatalog: idCatalog}, doNoOk);
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
    function cerrarNodo(params, doNoOk){
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
			$log.debug(" service editar ");
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

    
		///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                
    return nodeServiceInt;
	}
})();
