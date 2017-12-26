(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('MenuController', MenuController);

	/** @ngInject */
	function MenuController($scope, $log, $state, StateCommons, CTE_REST, $interval, ToastCommons,
		perfilService, contextoCompraService,us, usuario_dao, navigation_state, globalConfigurations) {
		$log.debug("MenuController ..... ");
		$log.debug(usuario_dao.getUsuario());

		var vm = this;
		vm.urlBase = CTE_REST.url_base;
		vm.vendedor = StateCommons.vendedor();

        vm.firstMenuItem = globalConfigurations[CTE_REST.idVendedor].menus[0];
        vm.tailMenuItems = globalConfigurations[CTE_REST.idVendedor].menus.slice(1, globalConfigurations[CTE_REST.idVendedor].menus.length);
          
        
		vm.options = {
			'rotation': 'circ-in',
			'duration': 1000
		};

		function initHeader() {
			vm.categorias = [];
			vm.usuario = usuario_dao.getUsuario();
			vm.isLogued = usuario_dao.isLogged();

			initRefreshNotification();
			resetNotificacion();
		}

		function resetNotificacion() {
			vm.callNotificaciones = false;
			vm.icon = 'notifications_none';
			vm.fill = 'white';
		}

		function addNotificacion() {
			vm.callNotificaciones = true;
			vm.icon = 'notifications';
			vm.fill = 'red';
			ToastCommons.mensaje(us.translate('LLEGO_NOTIFICACION'))
		}

		$scope.$on('resetHeader', function(event, msg) {
			initHeader();
		});

		$scope.$on('logout', function(event, msg) {
			vm.logOut();
		});

        vm.classFor = function(page) {
			return (navigation_state.getSelectedTab() == page)?"md-accent":"";
		}

		var llamadoPeriodico;

		vm.logOut = function() {
			$log.debug("Log Out ..... ");

			usuario_dao.logOut();
			contextoCompraService.clean();

			$interval.cancel(llamadoPeriodico);

			initHeader();

			$state.go('principal')
		}


		vm.verNotificaciones = function() {
			$log.debug("Ver notificaciones");
			vm.icon = 'notifications_none';
			vm.fill = 'white';
			$state.go('perfil', {
				index: 1
			});
		}


		function initRefreshNotification() {
			if (usuario_dao.isLogged() && !StateCommons.ls.notificacionActiva) { // TODO cambiar al generar DAOs (mensaje del 11/10)
				$log.debug("interval notifications");

				llamadoPeriodico = $interval(function() {
					$log.debug("call notificaciones nuevas?");
					callNotificacionesNoLeidas();
				}, CTE_REST.INTERVALO_NOTIFICACION_MIN);

				StateCommons.ls.notificacionActiva = true; // TODO cambiar al generar DAOs (mensaje del 11/10)
			}
		}

		function callNotificacionesNoLeidas() {

			function doOk(response) {
				$log.debug('callObtenerNotificaciones', response);

				vm.notificacionesSinLeer = 0;
				// TODO : filtro en el front , deberia ser por BE
				angular.forEach(response.data, function(value, key) {
					console.log(value.estado)
					if (value.estado == "NOTIFICACION_NO_LEIDA")
						vm.notificacionesSinLeer = vm.notificacionesSinLeer + 1;
				});

				if (vm.notificacionesSinLeer > 0) {
					$log.debug('hay nuevas notificaciones !');
					addNotificacion();
					//ToastCommons.mensaje("Hay notificaciones "+ response.data.length +" nuevas !");
				} else {
					resetNotificacion();
				}

			}
			//TODO : DEBERIAN SER solo las NO LEIDAS
			perfilService.notificacionesLeidas(1).then(doOk);
			//perfilService.notificacionesNoLeidas().then(doOk);	
		}


		initHeader();

	}
})();
