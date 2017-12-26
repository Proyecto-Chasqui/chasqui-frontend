(function() {
	'use strict';

	angular.module('chasqui').controller('LogInController', LogInController);

	/** @ngInject */
	function LogInController($log, $state, StateCommons,
		ToastCommons, $rootScope, dialogCommons, perfilService, us, $stateParams, contextoCompraService, usuario_dao) {

		$log.debug('controler log in ..... debe volver a ', $stateParams.toPage);

		var vm = this
		vm.user = {};

		vm.recuperar = function(ev) {
			dialogCommons.prompt('Recuperar contraseña',
				'Enviaremos instrucciones a tu correo',
				'correo@correo.com', 'Enviar', 'Cancelar',
				function(result) {
					vm.callReset(result)
				},
				function() {
					$log.debug('Cancelo correo')
				});
		};

		// ///// REST

		vm.login = function() {
			$log.debug('Log In ', vm.user);
			// TODO NO OK , que vuelva a donde vino
			function doOk(response, headers) {
				$log.debug('response login ', response);

				usuario_dao.logIn(response.data);

				ToastCommons.mensaje("Bienvenido !");

				var tmp = contextoCompraService.ls.varianteSelected;
				$rootScope.$broadcast('resetHeader', "");
				contextoCompraService.ls.varianteSelected=tmp;

				if (us.isUndefinedOrNull(contextoCompraService.ls.varianteSelected)) {
					if (us.isUndefinedOrNull($stateParams.toPage) || $stateParams.toPage == '') {
						$state.go("principal");
					} else {
						$state.go($stateParams.toPage);
					}
				} else {
					$state.go("catalogo");
				}
			}

			perfilService.login(vm.user).then(doOk)
		}

		vm.callReset = function(email) {

			function doOk(response) {
				ToastCommons.mensaje("Revisa tu correo !");
			}

			perfilService.resetPass(email).then(doOk)
		}

	}
})();
