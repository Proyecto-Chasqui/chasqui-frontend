(function() {
	'use strict';

	angular.module('chasqui').service('perfilService', perfilService);

	function perfilService($log, REST_ROUTES, StateCommons, promiseService, toastr) {
		var vm = this;

		vm.verDirecciones = function() {
			$log.debug(" service verDirecciones ");
			return promiseService.doGetPrivate(REST_ROUTES.verDirecciones, {});
		}

		vm.actualizarDireccion = function(direccion) {
			$log.debug(" service actualizarDireccion ");
			return promiseService.doPut(REST_ROUTES.actualizarDireccion, direccion);
		}

		vm.eliminarDireccion = function(id) {
			$log.debug(" service eliminarDireccion ");
			return promiseService.doDelete(REST_ROUTES.eliminarDireccion(id), {});
		}

		vm.nuevaDireccion = function(domicilio) {
			$log.debug(" service nuevaDireccion ");
			return promiseService.doPost(REST_ROUTES.nuevaDireccion, domicilio);
		}

		vm.notificacionesNoLeidas = function() {
			$log.debug(" service notificacionesNoLeidas ");
			return promiseService.doGetPrivate(REST_ROUTES.notificacionesNoLeidas, {});
		}

		vm.notificacionesLeidas = function(cantidad) {
			$log.debug(" service notificacionesLeidas ");
			return promiseService.doGetPrivate(REST_ROUTES.notificacionesLeidas(cantidad), {});
		}

		vm.totalNotificaciones = function(){
			return promiseService.doGetPrivate(REST_ROUTES.totalNotificaciones());
		}

		vm.notificacionesLeidas = function(id) {
			$log.debug(" service notificacionesLeidas ");
			return promiseService.doGetPrivate(REST_ROUTES.notificacionesLeidas(id), {});
		}

		vm.marcarComoLeido = function(id) {
			$log.debug(" service marcarComoLeido ");
			return promiseService.doPost(REST_ROUTES.notificacionesLeidas(id), {});
		}

		vm.cambiarPass = function(pass) {
			$log.debug(" service cambiarPass ");
			var params = {};
			params.password = pass;
			return promiseService.doPut(REST_ROUTES.editPassword, params);
		}

		vm.login = function(user) {
			$log.debug(" service login ");

			function doNoOk(response, headers) {
				toastr
					.error("Fallo la autenticación, verifique los datos", "Error");
			}

			return promiseService.doPostPublic(REST_ROUTES.login, user, doNoOk);
		}

		vm.resetPass = function(email) {
			$log.debug(" service resetPass ", email);

			function doNoOk(response) {
				$log.debug('response reset pass ', response);
				toastr.error("¿El mail es correcto ?", "Error");
			}

			return promiseService.doGet(REST_ROUTES.resetPass(email), {}, doNoOk);
		}

		vm.verUsuario = function() {
			$log.debug(" service verUsuario ");

			return promiseService.doGetPrivate(REST_ROUTES.verUsuario, {});
		}

		vm.editUsuario = function(user) {
			$log.debug(" service editUsuario ");
			return promiseService.doPut(REST_ROUTES.editUsuario, user);
		}
        
        vm.editAvatar = function(avatar){
            $log.debug(" service editAvatar ");
			return promiseService.doPost(REST_ROUTES.editAvatar, avatar);
		}

		vm.singUp = function(user) {
			$log.debug(" service singUp ");

			function doNoOk(response) {
				$log.debug("error al guardar usuario", response.data);

				if (response.status == 409) {
					toastr.error(response.data.error, "Error");
				} else {
					toastr
						.error('error inesperado, intente nuevamente' , "Error");
				}

			}

			return promiseService.doPostPublic(REST_ROUTES.singUp, user, doNoOk);
		}
        
    vm.singUpInvitacionGCC = function(user){
			$log.debug(" service singUpInvitacionGCC ");

			function doNoOk(response) {
				$log.debug("error al guardar usuario", response.data);

				if (response.status == 409) {
					toastr.error(response.data.error, "Error");
				} else {
					toastr
						.error('error inesperado, intente nuevamente' , "Error");
				}

			}

			return promiseService.doPostPublic(REST_ROUTES.singUpInvitacionGCC, user, doNoOk);
		}
        
    vm.getMailInvitacion = function(idInvitacion){
			$log.debug(" service obtenerMailInvitacion ");
                        
			function doNoOk(response) {
				$log.debug('response reset pass ', response);
				toastr.warn("El mail no tiene asociada una invitación", "Advertencia");
			}

			return promiseService.doPostPublic(REST_ROUTES.getMailInvitacionAlGCC, {
                idInvitacion: idInvitacion
            }, doNoOk);
		}
        
        
	} // function
})(); // anonimo
