(function() {
	'use strict';

	angular.module('chasqui').controller('ListaGruposController',
		ListaGruposController);

	/** @ngInject . Tabs de grupos con el panel de info y botones de acciones */
	function ListaGruposController($log, $scope, $state, $stateParams,
		StateCommons, dialogCommons, ToastCommons, perfilService, gccService, CTE_REST, 
		contextoCompraService, us, usuario_dao, navigation_state) {

		$log.debug("controler ListaGruposController");
		navigation_state.goMyGroupsTab();
		var vm = this;
		vm.habilita = false;
		vm.count = 0;
		vm.groups = [];
		vm.selected = null;
		vm.selectedIndexGrupo = 0;
		vm.urlBase = CTE_REST.url_base;

		/** Control de cambio de tabs */
 		$scope.$watch('listaGruposCtrl.selectedIndexGrupo', function(current, old) {
			vm.selected = vm.groups[current];	
 			$log.debug("selectedIndexGrupo", current);
			
			if (! us.isUndefinedOrNull(vm.selected)){
                console.log("Select group:", vm.selected, vm.groups);
				contextoCompraService.setContextoByGrupo(vm.selected.idGrupo);
			}
		});

		function setTabSeleccionado(grupo) {
			var i = 0
			var indexSelect = 0;
			var existe = false;
			$log.debug("Tabs: ", vm.groups);
			angular.forEach(vm.groups, function(tab) {
				$log.debug("setTabSeleccionado", tab.idGrupo + " " + tab.alias);
				if ((grupo != undefined) && (tab.idGrupo == grupo.idGrupo)) {
					indexSelect = i;
					existe = true;
				}

				i++;
			});

			if (existe) {
				vm.selected = vm.groups[indexSelect];
				vm.selectedIndexGrupo = indexSelect;
				vm.selectedIndexGrupo = indexSelect;
			}

		}
		/*
		$scope.$on('quito-miembro-grupo',
			function(event) {
				callLoadGrupos();
			});
		*/
		vm.edit = function(grupo) {
			$state.go("form-grupo", { "grupo": grupo });
		}

		/** habilita el panel para agregar integrantes. */
		vm.invitarUsuario = function(grupo) {
			$log.debug("Invitar miembro al grupo");

			function doOk(response) {
				$log.debug("Se seleccionó Invitar a usuario con mail", response);
				callInvitarUsuario(response, grupo);

			};

			function doNoOk() {
				$log.debug("Se seleccionó Cancelar");
			};


			dialogCommons.prompt(us.translate('INV_MIEMBRO'),
				us.translate('INGRESAR_CORREO'), 'correo@correo.com',
				us.translate('INVITAR'), us.translate('CANCELAR'), doOk, doNoOk);

		}

		/** Salir del grupo. Manejo del popUP */
		vm.salir = function(tab) {
			dialogCommons.confirm(us.translate('SALIR'), us.translate('SEGURO_SALIR') +
				vm.selected.alias, us.translate('SI_MEVOY'), us.translate('CANCELAR'),
				function(
					result) {
					callQuitarMiembro(tab);
				},
				function() {
					$log.debug("se quedo");
				});
		}

		/** Redirecciona al formulario crear grupo */
		vm.crearGrupo = function(ev) {
			$state.go('form-grupo');			
		};


		vm.crearPedidoGrupal = function(grupo) {
			$log.debug("--- Crear pedido grupal----", grupo);
			callCrearPedidoGrupal(grupo);
		}


		// ///////////
		// ///// REST

		function callCrearPedidoGrupal(grupo) {
			function doOk(response) {
				$log.debug('Crear pedido en el grupo');
				ToastCommons.mensaje(us.translate('NUEVO_PEDIDO'));
			}

			var params = {};
			params.idGrupo = grupo.idGrupo;
			params.idVendedor = $stateParams.idCatalog;

			gccService.crearPedidoGrupal(params).then(doOk);
		}

		function callInvitarUsuario(emailClienteInvitado, grupo) {
			$log.debug('callInvitarUsuario con email: ', emailClienteInvitado);


			var doOk = function(response) {
				$log.log('Se enviará un email a la direcciónn ', response);
				ToastCommons.mensaje(us.translate('ENVIARA_MAIL'));
				//callLoadGrupos();
				var recienInvitado = {avatar: null, nickname: null, email: emailClienteInvitado, invitacion: "NOTIFICACION_NO_LEIDA", estadoPedido: "INEXISTENTE",pedido:null};
				grupo.miembros.push(recienInvitado);
			}

			var params = {
				idGrupo: grupo.idGrupo,
				emailInvitado: emailClienteInvitado
			}
			gccService.invitarUsuarioAGrupo(params).then(doOk);
		}

		function callLoadGrupos() {
			$log.debug("--- find grupos--------");

			contextoCompraService.getGrupos().then(function(groups){
				$log.debug("--- find grupos respuesta", groups);
				vm.groups = groups.getGroups().filter(function(g){return g.alias != "Personal"});
				setTabSeleccionado(contextoCompraService.getGroupSelected());
            });
		}

		function callQuitarMiembro(miembro) {
			$log.debug("quitar", miembro)

			function doOk(response) {
				ToastCommons.mensaje(us.translate('TE_FUISTE_GRUPO'))
				callLoadGrupos();
			}
			var params = {};
			params.idGrupo = miembro.idGrupo;
			params.emailCliente = usuario_dao.getUsuario().email; 
			gccService.quitarMiembro(params).then(doOk)

		}


		// // INIT
		callLoadGrupos();

	}

})();
