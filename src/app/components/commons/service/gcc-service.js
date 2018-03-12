(function() {
	'use strict';

	angular.module('chasqui').service('gccService', gccService);

	function gccService($log, REST_ROUTES, StateCommons, promiseService, ToastCommons) {
		var vm = this;
		var idVend = StateCommons.vendedor().id;

		vm.groupsByUser = function() {
			$log.debug(" service groupsByUser ");
			return promiseService.doGetPrivate(REST_ROUTES.groupsByUser(StateCommons.vendedor().id), {});
		}

		vm.nuevoGrupo = function(params) {
			$log.debug(" service groupsByUser ");
			//return promiseService.doPost(REST_ROUTES.groupsByUser(id),contacts);
			params.idVendedor = idVend;
			return promiseService.doPost(REST_ROUTES.nuevoGrupo, params);
		}

		vm.editarGrupo = function(idGrupo, params) {
			$log.debug(" service editarGrupo ", params);
			return promiseService.doPut(REST_ROUTES.editarGrupo(idGrupo), params);
		}

		vm.invitarUsuarioAGrupo = function(params) {
			$log.debug(" service invitarUsuarioAGrupo ");
			return promiseService.doPost(REST_ROUTES.invitarUsuarioAGrupo, params);
		}

		vm.aceptarInvitacionAGrupo = function(params) {
			$log.debug(" service aceptarInvitacionAGrupo ");
			return promiseService.doPost(REST_ROUTES.aceptarInvitacionAGrupo, params);
		}

		vm.rechazarInvitacionAGrupo = function(params) {
			$log.debug(" service aceptarInvitacionAGrupo ");
			return promiseService.doPost(REST_ROUTES.rechazarInvitacionAGrupo, params);
		}

		vm.crearPedidoGrupal = function(params, doNoOK) {
			$log.debug(" service crearPedidoGrupal ");
			return promiseService.doPost(REST_ROUTES.crearPedidoGrupal, params, doNoOK);
		}

		vm.pedidosByUser = function(doNoOK) {
			$log.debug(" service pedidosByUser ");
			return promiseService.doGetPrivate(REST_ROUTES.pedidosByUser(StateCommons.vendedor().id), {}, doNoOK);
		}

		vm.quitarMiembro = function(params) {
			$log.debug(" service quitarMiembro ");
			return promiseService.doPost(REST_ROUTES.quitarMiembro, params);
		}
        
        vm.cederAdministracion = function(params){
            return promiseService.doPost(REST_ROUTES.cederAdministracion, params);
        }

		/*vm.confirmarPedidoColectivo = function(idGrupo) {
			var params = {};
			params.idGrupo = idGrupo;
			return promiseService.doPost(REST_ROUTES.confirmarPedidoColectivo, params);
		}*/

		// Modificado por Favio 28-9 
		vm.confirmarPedidoColectivo = function(params) {
			console.log(".... Confirmar pedido colectivo...");
			return promiseService.doPost(REST_ROUTES.confirmarPedidoColectivo, params);
		}

		vm.confirmarPedidoIndividualGcc = function(idPedido) {
			var params = {};
			params.idPedido = idPedido;
			return promiseService.doPost(REST_ROUTES.confirmarPedidoIndividualGcc, params);
		}
		///////////////////////////////
		/////////// MOCKS 

		//---- DESCOMENTADOS Y DESMOCKEADOS EN index.constants.js por FAVIO 13-6

		vm.salirGrupo = function(id, idSelect) {
			$log.debug(" service salirGrupo ");
			return promiseService.doGet(REST_ROUTES.salirGrupo(id, idSelect), {});
		}

		vm.integrantesGrupo = function(id, contacts) {
			$log.debug(" service integrantesGrupo ");
			return promiseService.doGet(REST_ROUTES.integrantesGrupo(id), contacts);
		}

		vm.direccionGrupo = function(id, direccion) {
			$log.debug(" service direccionGrupo ");
			return promiseService.doPost(REST_ROUTES.direccionGrupo(id), direccion);
		}

		//-------- DESCOMENTADOS Y DESMOCKEADOS EN index.constants.js por FAVIO 13-6
		/////////////////////////////////////////

		/*
		  

        	productosDestacadosByVendedor : function(idVendedor){
        		return URL_REST_BASE +"client/producto/destacados/"+idVendedor;
        	},
        	

            

            
            
	 */
	} // function
})(); // anonimo
