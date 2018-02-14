(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogMenuController', CatalogMenuController);

	
	function CatalogMenuController($scope, $log, $state, StateCommons, CTE_REST, $interval, ToastCommons,
		perfilService, contextoCompraService,us, usuario_dao, navigation_state) {
        
		
		$scope.urlBase = CTE_REST.url_base;
		$scope.vendedor = StateCommons.vendedor();

		$scope.options = {
			'rotation': 'circ-in',
			'duration': 1000
		};

		function initHeader() {
			$scope.categorias = [];
			$scope.usuario = usuario_dao.getUsuario();
            $scope.isLogued = usuario_dao.isLogged();
            
			initRefreshNotification();
			resetNotificacion();
		}

		function resetNotificacion() {
			$scope.callNotificaciones = false;
			$scope.icon = 'notifications_none';
			$scope.fill = 'white';
		}

		function addNotificacion() {
			$scope.callNotificaciones = true;
			$scope.icon = 'notifications';
			$scope.fill = 'red';
			ToastCommons.mensaje(us.translate('LLEGO_NOTIFICACION'))
		}

		$scope.$on('resetHeader', function(event, msg) {
			initHeader();
		});

		$scope.$on('logout', function(event, msg) {
			$scope.logOut();
		});

       

		var llamadoPeriodico;

		$scope.logOut = function() {
			$log.debug("Log Out ..... ");

			usuario_dao.logOut();
			contextoCompraService.clean();

			$interval.cancel(llamadoPeriodico);

			initHeader();

			$state.go('principal')
		}


		$scope.verNotificaciones = function() {
			$log.debug("Ver notificaciones");
			$scope.icon = 'notifications_none';
			$scope.fill = 'white';
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

				$scope.notificacionesSinLeer = 0;
				// TODO : filtro en el front , deberia ser por BE
				angular.forEach(response.data, function(value, key) {
					console.log(value.estado)
					if (value.estado == "NOTIFICACION_NO_LEIDA")
						$scope.notificacionesSinLeer = $scope.notificacionesSinLeer + 1;
				});

				if ($scope.notificacionesSinLeer > 0) {
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
