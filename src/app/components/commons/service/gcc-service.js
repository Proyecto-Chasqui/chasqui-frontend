(function() {
	'use strict';

	angular.module('chasqui').service('gccService', gccService);

	function gccService($log, CTE_REST, StateCommons, promiseService, ToastCommons, $stateParams) {
		var vm = this;

		vm.pedidosByUser = function(doNoOK) {
			$log.debug(" service pedidosByUser ");
			return promiseService.doGetPrivate(CTE_REST.pedidosByUser($stateParams.idCatalog), {}, doNoOK);
		}
        
		vm.groupsByUser = function() {
			$log.debug(" service groupsByUser ");
			return promiseService.doGetPrivate(CTE_REST.groupsByUser($stateParams.idCatalog), {});
		}

		vm.nuevoGrupo = function(params) {
			$log.debug(" service groupsByUser ");
			params.idVendedor = $stateParams.idCatalog;
			return promiseService.doPost(CTE_REST.nuevoGrupo, params);
		}

		vm.editarGrupo = function(idGrupo, params) {
			$log.debug(" service editarGrupo ", params);
			return promiseService.doPut(CTE_REST.editarGrupo(idGrupo), params);
		}

		vm.invitarUsuarioAGrupo = function(params) {
			$log.debug(" service invitarUsuarioAGrupo ");
			return promiseService.doPost(CTE_REST.invitarUsuarioAGrupo, params);
		}

		vm.aceptarInvitacionAGrupo = function(params) {
			$log.debug(" service aceptarInvitacionAGrupo ");
			return promiseService.doPost(CTE_REST.aceptarInvitacionAGrupo, params);
		}

		vm.rechazarInvitacionAGrupo = function(params) {
			$log.debug(" service aceptarInvitacionAGrupo ");
			return promiseService.doPost(CTE_REST.rechazarInvitacionAGrupo, params);
		}

		vm.crearPedidoGrupal = function(params, doNoOK) {
			$log.debug(" service crearPedidoGrupal ");
			return promiseService.doPost(CTE_REST.crearPedidoGrupal, params, doNoOK);
		}

		vm.quitarMiembro = function(params) {
			$log.debug(" service quitarMiembro ");
			return promiseService.doPost(CTE_REST.quitarMiembro, params);
		}

		/*vm.confirmarPedidoColectivo = function(idGrupo) {
			var params = {};
			params.idGrupo = idGrupo;
			return promiseService.doPost(CTE_REST.confirmarPedidoColectivo, params);
		}*/

		// Modificado por Favio 28-9 
		vm.confirmarPedidoColectivo = function(params) {
			console.log(".... Confirmar pedido colectivo...");
			return promiseService.doPost(CTE_REST.confirmarPedidoColectivo, params);
		}

		vm.confirmarPedidoIndividualGcc = function(idPedido) {
			var params = {};
			params.idPedido = idPedido;
			return promiseService.doPost(CTE_REST.confirmarPedidoIndividualGcc, params);
		}
		///////////////////////////////
		/////////// MOCKS 

		//---- DESCOMENTADOS Y DESMOCKEADOS EN index.constants.js por FAVIO 13-6

		vm.salirGrupo = function(id, idSelect) {
			$log.debug(" service salirGrupo ");
			return promiseService.doGet(CTE_REST.salirGrupo(id, idSelect), {});
		}

		vm.integrantesGrupo = function(id, contacts) {
			$log.debug(" service integrantesGrupo ");
			return promiseService.doGet(CTE_REST.integrantesGrupo(id), contacts);
		}

		vm.direccionGrupo = function(id, direccion) {
			$log.debug(" service direccionGrupo ");
			return promiseService.doPost(CTE_REST.direccionGrupo(id), direccion);
		}

	} // function
})(); // anonimo
