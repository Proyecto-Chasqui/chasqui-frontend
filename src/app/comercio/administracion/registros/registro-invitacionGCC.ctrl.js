(function() {
	'use strict';

	angular.module('chasqui').controller('RegistroInvitacionGCCController',
		RegistroInvitacionGCCController);

	/** Contempla los datos personales y 
	 *  el domicilio en dos pasos pero en la misma pantalla*/
	function RegistroInvitacionGCCController($log, $state, $stateParams, $scope, perfilService, ToastCommons, us, $timeout) {
        
        $scope.selectedIndex = 0;
        
        
        var idInvitacion = $stateParams.idCatalog;
        
        $scope.mailInvitacion = "";
        
        perfilService.getMailInvitacion(idInvitacion).then(function(data){
            $scope.mailInvitacion = "";
        })
        
        /////////////////////////////////// Configuración form usuario  ///////////////////////////////////
        
        var disabledFields = [];
        var hiddenFields = ["email", "emailVerification"];
        
        $scope.disableField = function(field){
            return disabledFields.includes(field);
        }
        
        
        $scope.hideField = function(field){
            return hiddenFields.includes(field);
        }
        
        
        $scope.showLabel = function(profile){
            return true;
        }
        
        
        $scope.guardar = function(profile) {
            /* Verificar:
             *      - contraseñas identicas
             */            
            
			if (profile.password === profile.passVerification) {
                //$scope.selectedIndex ++;                
                callGuardar(profile);
            }else{
				$log.error("las contrasenas no coinciden: ", profile.password, profile.passVerification);
				// TODO: enviar mensaje
				ToastCommons.mensaje(us.translate('PASS_INCORRECTO_MSG'))
            }
		}
        
        $scope.next = $scope.guardar;
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        // usuario nuevo
		function callGuardar(profile) {
			$log.debug("guardar usuario", profile);
            function doOk(response) {
                mostrarMensajesDeBienvenida();                    
                $log.debug("Nuevo usuario creado", response.data);                    
                /*
                    Algo se deberia hacer con la informacion que esta trayendo el servidor
                */
                //usuario_dao.logIn(response.data); 
                $state.go('login');
            }
            
            perfilService.singUpInvitacionGCC(prepareProfile(profile)).then(doOk);
		}
        
        
        function prepareProfile(profile){
            return addFields(
                        filterFields(profile, ["passVerification", "emailVerification", "email"]), 
                        {invitacion: idInvitacion}
                    );
        }
        
          ////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\
         ///////      Buenas funciones [Juan, 14/11/17]     \\\\\\\
        ////////////////////////////    \\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        function filterFields(obj, fields){
            var res = {};
            for (var field in obj){
                if (!fields.includes(field)) res[field] = obj[field];
            }
            return res;
        }
        
        function addFields(obj, fields){
            for(var key in fields){
                obj[key] = fields[key];
            }
            return obj;
        }
        
        
        /////////////                                  \\\\\\\\\\\\\
        
		function mostrarMensajesDeBienvenida() {

			$timeout(function() {
				ToastCommons.mensaje(us.translate('BIENVENIDO'));
			}, 3000);

			$timeout(function() {
				ToastCommons.mensaje(us.translate('INGRESA_MSG'));
			}, 10000);

			$timeout(function() {
				ToastCommons.mensaje(us.translate('CORREO_MSG'));
			}, 15000);
		}
	}

})();
