(function(){
	'use strict';

	angular.module('chasqui').service('nodeService', nodeService);

	function nodeService($log, REST_ROUTES, promiseService, 
                         $stateParams, contextCatalogsService, setPromise){
		
    const nodeServiceInt = {
      nodosTodos: nodosTodos,
      nuevoNodo: nuevoNodo,
      cerrarNodo: cerrarNodo,
      editarNodo: editarNodo,

    };

		function nodosTodos(idCatalog, doNoOK){
			$log.debug(" service nodosTodos ");
			return promiseService.doGetPrivate(REST_ROUTES.nodosTodos(idCatalog), {}, doNoOK);
    }
    
    /*
      params = {
        "idVendedor" : 2,
        "nombreNodo" : "alias Grupo",
        "descripcion" : "descripcion",
        "idDomicilio" : 2,
        "tipoNodo" : "NODO_ABIERTO",
        "barrio" : "un barrio",
        "descripcion":"descripcion
      }
    */
    function nuevoNodo(params, doNoOk){
			$log.debug(" service nodosTodos ");
			return promiseService.doPost(REST_ROUTES.nuevoNodo, params, doNoOK);
    }

    /* 
      params = {
        "idGrupo": 1,
        "idVendedor": 2
      }
    */
    function cerrarNodo(params, doNoOk){
			$log.debug(" service cerrarNodo ");
			return promiseService.doPost(REST_ROUTES.cerrarNodo, params, doNoOK);
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
    function editarNodo(params, doNoOk){
			$log.debug(" service editarNodo ");
			return promiseService.doPost(REST_ROUTES.editarNodo, params, doNoOK);
    }


    
		///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                
        return nodeServiceInt;
	}
})();
