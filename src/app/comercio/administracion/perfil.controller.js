(function() {
	'use strict';

	angular.module('chasqui').controller('PerfilController', PerfilController);

    
	function PerfilController($log, $scope, $rootScope,
		$mdDialog, ToastCommons, toastr, $stateParams, perfilService,
		gccService,us,contextPurchaseService, usuario_dao, navigation_state) {
            
		$log.debug("Init PerfilController ....");

		navigation_state.goPerfilTab();
		var vm = this;

		vm.direcciones;
    vm.oldPassword = "";
		vm.pass1 = "";
		vm.pass2 = "";
    vm.oldPassNotMatch = false;

		vm.notificaciones = [];
		vm.notificacionesNoLeidas = [];
    vm.notificacionesEnVista = [];
		vm.count = 1;
    vm.pages = 1;

		vm.selectedIndexPerfil = 0;
		if ($stateParams.index != null) {
			vm.selectedIndexPerfil = $stateParams.index;
		}

    $scope.currentPage = 0;

    $scope.paging = {
        total: vm.pages,
        current: 1,
        onPageChanged: loadPages,
    };

    function loadPages() {
        console.log('Current page is : ' + $scope.paging.current);
        vm.count = $scope.paging.current;
        callNotificaciones();
        $scope.currentPage = $scope.paging.current;
    }

    
    // Cambio de contraseña
    
		vm.cambiarPassConfirmar = function() {
			$log.debug('call direcciones response ', vm.pass1);
			if (vm.pass1 != '' && (vm.pass1 === vm.pass2)) {
				callCambiarPass();
			} else {
				toastr.error(us.translate('PASS_INCORRECTO_MSG'), "Error");
			}
		}

		var callCambiarPass = function() {
			function doOk(response) {
				toastr.success(us.translate('PASS_ACTUALIZADA'), us.translate('AVISO_TOAST_TITLE'));
        vm.oldPassword = "";
        vm.pass1 = "";
        vm.pass2 = "";
        vm.oldPassNotMatch = false;
			}

			function doNoOk(response) {
				toastr.error("La contraseña anterior no es válida");
        vm.oldPassNotMatch = true;
        vm.oldPassword = "";
			}

			perfilService.cambiarPass(vm.pass1, vm.oldPassword, doNoOk).then(doOk);
		}

    
    
    // Notificaciones
    
    
		vm.marcarLeido = function(notificacion) {
			function doOk(response) {
				notificacion.estado = 'Leido';
                $rootScope.refrescarNotificacion();
			}
			perfilService.marcarComoLeido(notificacion.id).then(doOk);

		}

		vm.aceptarInvitacion = function(notificacion) {
			function doOk(response) {
				toastr.success(us.translate('ACEPTADO'), us.translate('AVISO_TOAST_TITLE'));
				notificacion.estado = 'Leido';
				contextPurchaseService.refreshGrupos()
			}
			var params = {};
			params.idInvitacion = notificacion.id;

			gccService.aceptarInvitacionAGrupo(params).then(doOk)

		}

		vm.rechazarInvitacion = function(notificacion) {
			function doOk(response) {
				toastr.info(us.translate('RECHAZADO'), us.translate('AVISO_TOAST_TITLE') );
				notificacion.estado = 'Leido';
			}
			var params = {};
			params.idInvitacion = notificacion.id;

			gccService.rechazarInvitacionAGrupo(params).then(doOk)

		}


		function callNotificacionesNoLeidas() {

			function doOk(response) {
				$log.debug('notificacionesNoLeidas', response);
				vm.notificacionesNoLeidas = response.data;
			}
			perfilService.notificacionesNoLeidas().then(doOk);
		}

		function callNotificaciones() {

			function doOk(response) {
				$log.debug('notificacionesLeidas', response);
				vm.notificaciones = response.data;
			}
			perfilService.notificacionesLeidas(vm.count).then(doOk);

		}

        function totalNotificaciones(){
            function doOk(response) {
                $log.debug('totalNotificaciones', response.data);
                vm.pages = Math.ceil(response.data / 5);
                $scope.paging = {
                    total: vm.pages,
                    current: 1,
                    onPageChanged: loadPages,
                };
                callNotificaciones();
            }
            perfilService.totalNotificaciones().then(doOk);
        }

		vm.verMas = function() {
			vm.count++;
			$log.debug('ver mas', vm.count);
			callNotificaciones();
		}

		vm.isCompraColectiva=function(notificacion){			
			return us.contieneCadena(notificacion.mensaje ,'ha invitado al grupo de compras colectivas');
		}

    vm.getColor = function(notificacion){
         var color = 'green';
         if(us.contieneCadena(notificacion.mensaje ,'ha invitado al grupo de compras colectivas') 
            && notificacion.estado === "NOTIFICACION_NO_LEIDA"){
            color = 'deep-purple';
         }

         if(us.contieneCadena(notificacion.mensaje ,'ha invitado al grupo de compras colectivas') 
            && notificacion.estado === "NOTIFICACION_ACEPTADA"){
            color = 'light-green'; 
         }

         if(us.contieneCadena(notificacion.mensaje ,'ha invitado al grupo de compras colectivas') 
            && notificacion.estado === "NOTIFICACION_RECHAZADA"){
            color = 'red'; 
         }

         if(!us.contieneCadena(notificacion.mensaje ,'ha invitado al grupo de compras colectivas') 
            && notificacion.estado === "NOTIFICACION_NO_LEIDA"){
            color = 'lime';
         }
         return color;
    }
    
    
    totalNotificaciones();
		callNotificacionesNoLeidas();
        
        
        
    ///////////////////////////////////////////
    //////////// Perfil  functions ////////////
    ///////////////////////////////////////////

    var disabledFields = [];
    var hiddenFields = ["email", "emailVerification", "password", "passVerification"];

    $scope.disableField = function(field){
        return disabledFields.includes(field) || !editting;
    }


    $scope.hideField = function(field){
        return hiddenFields.includes(field);
    }


    // Botones:

    var editting = false;
    var previousProfile = {};

    $scope.editProfile = function(profile){
        editting = true;
        previousProfile = copy(profile);
    }

    function copy(copied){
        var res = {};
        for(var field in copied){
            res[field] = copied[field];
        }
        return res;
    }

    $scope.showEdit = function(profile){
        return !editting;
    }

    $scope.cancelEditProfile = function(profile){
        editting = false;
        // No se por qué cuando uso el copy definido mas arriba no se actualiza el form. 
        // Debe ser una cuestión de referencias. (Juan Acosta, 8/11/2017)
        for(var field in previousProfile){
            profile[field] = previousProfile[field];
        }
    }

    $scope.showCancel = function(profile){
        return editting;
    }

    $scope.saveProfile = function(profile){
        callActualizarUsuario(profile);
        editting = false;
    }

    $scope.showSave = $scope.showCancel;

    ////////////// Avatar

    $scope.disableAvatarSelection = function(){
        return !editting;
    }

        
    // ///////// llamadas


    function callActualizarUsuario(profile){
      console.log("Actualizando:", profile);
			function doOk(response) {
        console.log("Resultado de actualizar datos:", response);
        usuario_dao.logIn(response.data);
				toastr.success(us.translate('ACTUALIZO_PERFIL_MSG'), us.translate('AVISO_TOAST_TITLE'));
        location.reload(); // para recargar el avatar. TODO revisar $localStorage
			}
            
		  delete profile['direccion'];
      delete profile['email'];            
            
			// TODO : manejar error
			// ToastCommons.mensaje('Falla actulizar. Ver Trello');
			if (profile['telefonoMovil'] !== null || profile['telefonoFijo'] !== null) {
				perfilService.editUsuario(profile).then(doOk);
			}	
		}
      
    
    ///////////////////////////////////////////
    /////////// Addresses functions ///////////
    ///////////////////////////////////////////


    $scope.save = function(address) {
        $log.debug("Guardar Domicilio , nuevo? ", address.isNew);
        if (address.isNew) {
            callNuevaDireccion(filterFields(address, ["isNew"]));
        } else {
            callUpdateDireccion(filterFields(address, ["isNew"]));
        }
        $scope.$emit('cambioANuevaDireccion');
    }


    function filterFields(obj, fields){
        var res = {};
        for (var field in obj){
            if (!fields.includes(field)) res[field] = obj[field];
        }
        return res;
    }

    $scope.markAsPrimary = function(address) {
        $log.debug("marcar como predeterminado");

        function doOk(response) {
            $log.debug("respuesta marcar como predeterminado ", response);
            address.predeterminada = true;
            toastr.info(us.translate('PREDETERMINADO'), us.translate('AVISO_TOAST_TITLE'));
        }

        perfilService.actualizarDireccion(address).then(doOk);
    }

    $scope.delete = function(callback) {
        return function(address){
            $log.debug("eliminar direccion");

            function doOk(response) {
                $log.debug("respuesta eliminar direccion ", response);
                toastr.success(us.translate('ELIMINO_DIRECCION'), us.translate('AVISO_TOAST_TITLE'));
                callback(address);
            }

            perfilService.eliminarDireccion(address.idDireccion).then(doOk);
        }
    }

    var callNuevaDireccion = function(address) {
        $log.debug("guardar domicilio", address);

        function doOk(response) {
            $log.debug("respuesta guardar domicilio ", response);
            toastr.success(us.translate('AGREGO_DIRECCION'), us.translate('AVISO_TOAST_TITLE'));
            $rootScope.$broadcast('addNewAddress', response.data);
        }

        address.predeterminada = true; // TODO : si es el primero deberia ser TRUE sino no

        perfilService.nuevaDireccion(address).then(doOk);
    }

    var callUpdateDireccion = function(address) {
        $log.debug("update domicilio", address);

        function doOk(response) {
            $log.debug("respuesta update domicilio ", response);
            toastr.success(us.translate('ACTUALIZO_DIRECCION'), us.translate('AVISO_TOAST_TITLE'));
            $rootScope.$broadcast('newAddress', response.data);
        }

        address.predeterminada = false;
        perfilService.actualizarDireccion(address).then(doOk);

    }

	}

})();
