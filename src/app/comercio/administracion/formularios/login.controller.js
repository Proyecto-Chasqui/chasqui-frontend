(function() {
	'use strict';

	angular.module('chasqui').controller('LogInController', LogInController);

	/** @ngInject */
	function LogInController($log, $state, StateCommons, contextCatalogObserver,
		ToastCommons,toastr, $rootScope, dialogCommons, perfilService, us, contextPurchaseService, usuario_dao) {

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

				toastr.info(us.translate('BIENVENIDO'));

				var tmp = contextPurchaseService.ls.varianteSelected;
				$rootScope.$broadcast('resetHeader', "");
				contextPurchaseService.ls.varianteSelected=tmp;
        contextCatalogObserver.restart();
        $rootScope.$broadcast('resetCatalogInfo', "");
        $rootScope.refrescarNotificacion();
				if (us.isUndefinedOrNull(contextPurchaseService.ls.varianteSelected)) {
				    $state.go("catalog.landingPage");
				} else {
					$state.go("catalog.products");
				}
			}

			perfilService.login(vm.user).then(doOk)
		}

		vm.callReset = function(email) {

			function doOk(response) {
				toastr.success("Revisa tu correo !","Cuenta creada");
			}

			perfilService.resetPass(email).then(doOk)
		}

	}
})();
