(function() {
	'use strict';

	angular.module('chasqui').controller('LogInController', LogInController);

	/** @ngInject */
	function LogInController($log, $state, contextCatalogObserver, $stateParams,
		toastr, $rootScope, dialogCommons, perfilService, us, contextPurchaseService, usuario_dao) {

		var vm = this
		vm.user = {};

    function toTop(){
      window.scrollTo(0,0);
    }

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
        $rootScope.$broadcast('resetCatalogInfo', "");
        $rootScope.refrescarNotificacion();

        if($stateParams.toPage){
          $state.go($stateParams.toPage);
        } else if (contextPurchaseService.ls.varianteSelected) {
					$state.go("catalog.products");
				} else {
          $state.go("catalog.landingPage");
				}
			}

			perfilService.login(vm.user).then(doOk)
		}

		vm.callReset = function(email) {

			function doOk(response) {
				toastr.success("Se envió a tu correo la nueva contraseña","Contraseña reestablecida");
			}

			perfilService.resetPass(email).then(doOk)
    }
    
    function init(){
      vm.user.email = $stateParams.mail;
      toTop();
    }


    init();
	}
})();
