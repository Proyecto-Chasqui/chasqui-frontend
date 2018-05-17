(function(){
	'use strict';

	angular.module('chasqui').service('gccService', gccService);

	function gccService($log, REST_ROUTES, StateCommons, promiseService, ToastCommons, 
                         $stateParams, contextCatalogsService, setPromise){
		
        var gccServiceInt = {
            pedidosByUser: pedidosByUser,
            groupsByUser: groupsByUser,
            nuevoGrupo: nuevoGrupo,
            editarGrupo: editarGrupo,
            invitarUsuarioAGrupo: invitarUsuarioAGrupo,
            aceptarInvitacionAGrupo: aceptarInvitacionAGrupo,
            rechazarInvitacionAGrupo: rechazarInvitacionAGrupo,
            crearPedidoGrupal: crearPedidoGrupal,
            quitarMiembro: quitarMiembro,
            cederAdministracion: cederAdministracion,
            confirmarPedidoColectivo: confirmarPedidoColectivo,
            confirmarPedidoIndividualGcc: confirmarPedidoIndividualGcc,
            salirGrupo: salirGrupo,
            integrantesGrupo: integrantesGrupo,
            direccionGrupo: direccionGrupo,
            
        };

		function pedidosByUser(idCatalog, doNoOK){
			$log.debug(" service pedidosByUser ");
			return promiseService.doGetPrivate(REST_ROUTES.pedidosByUser(idCatalog), {}, doNoOK);
		}
        
		function pedidosByUser(doNoOK){
			return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service pedidosByUser ");
			         defered.resolve(promiseService.doGetPrivate(REST_ROUTES.pedidosByUser(catalog.id), {}, doNoOK));
                });
            });
		}
        
		function groupsByUser(){
			return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service groupsByUser ");
			        defered.resolve(promiseService.doGetPrivate(REST_ROUTES.groupsByUser(catalog.id), {}));
                });
            });
		}

		function nuevoGrupo(params){
			return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service groupsByUser ");
                    params.idVendedor = catalog.id;
                    defered.resolve(promiseService.doPost(REST_ROUTES.nuevoGrupo, params));
                });
            })
		}

		function editarGrupo(idGrupo, params){
			$log.debug(" service editarGrupo ", params);
			return promiseService.doPut(REST_ROUTES.editarGrupo(idGrupo), params);
		}

		function invitarUsuarioAGrupo(params){
			$log.debug(" service invitarUsuarioAGrupo ");
			return promiseService.doPost(REST_ROUTES.invitarUsuarioAGrupo, params);
		}

		function aceptarInvitacionAGrupo(params){
			$log.debug(" service aceptarInvitacionAGrupo ");
			return promiseService.doPost(REST_ROUTES.aceptarInvitacionAGrupo, params);
		}

		function rechazarInvitacionAGrupo(params){
			$log.debug(" service aceptarInvitacionAGrupo ");
			return promiseService.doPost(REST_ROUTES.rechazarInvitacionAGrupo, params);
		}

		function crearPedidoGrupal(params, doNoOK){
			$log.debug(" service crearPedidoGrupal ");
			return promiseService.doPost(REST_ROUTES.crearPedidoGrupal, params, doNoOK);
		}
        
		function quitarMiembro(params){
			$log.debug(" service quitarMiembro ");
			return promiseService.doPost(REST_ROUTES.quitarMiembro, params);
		}
        
        function cederAdministracion(params){
            return promiseService.doPost(REST_ROUTES.cederAdministracion, params);
        }

		// Modificado por Favio 28-9 
		function confirmarPedidoColectivo(params){
			console.log(".... Confirmar pedido colectivo...");
			return promiseService.doPost(REST_ROUTES.confirmarPedidoColectivo, params);
		}

		function confirmarPedidoIndividualGcc(idPedido){
			var params = {};
			params.idPedido = idPedido;
			return promiseService.doPost(REST_ROUTES.confirmarPedidoIndividualGcc, params);
		}
		
		function salirGrupo(id, idSelect){
			$log.debug(" service salirGrupo ");
			return promiseService.doGet(REST_ROUTES.salirGrupo(id, idSelect), {});
		}

		function integrantesGrupo(id, contacts){
			$log.debug(" service integrantesGrupo ");
			return promiseService.doGet(REST_ROUTES.integrantesGrupo(id), contacts);
		}

		function direccionGrupo(id, direccion){
			$log.debug(" service direccionGrupo ");
			return promiseService.doPost(REST_ROUTES.direccionGrupo(id), direccion);
		}

        
		///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                
        return gccServiceInt;
	}
})();
