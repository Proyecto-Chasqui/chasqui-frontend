(function() {
	'use strict';

	angular.module('chasqui').controller('RegistroController',
		RegistroController);

	/** Contempla los datos personales y 
	 *  el domicilio en dos pasos pero en la misma pantalla*/
	function RegistroController($log, $state, $scope, perfilService, ToastCommons, toastr, us, $timeout) {
        
        $scope.selectedIndex = 0;
        
        var disabledFields = [];
        var hiddenFields = [];
        
        $scope.disableField = function(field){
            return disabledFields.includes(field);
        }
        
        
        $scope.hideField = function(field){
            return hiddenFields.includes(field);
        }
        
        
        $scope.showLabel = function(profile){
            return true;
        }
        
        $scope.next = function(perfil){
            /* Verificar:
             *      - mails identicos
             *      - contraseñas identicas
             *      - que el mail no esté en uso (para evitar duplicación de registro)
             */            
            
			if (perfil.password === perfil.passVerification &&
                perfil.email === perfil.emailVerification) {
                //$scope.selectedIndex ++;                
                $scope.guardar(perfil);
            }else{
				$log.debug("las contrasenas no coinciden: ", perfil.password, perfil.passVerification);
				// TODO: enviar mensaje
				toastr.error(us.translate('PASS_INCORRECTO_MSG'), "Error");
            }
        }
        
        $scope.guardar = function(perfil) {
            /* Verificar:
             *      - mails identicos
             *      - contraseñas identicas
             *      - que el mail no esté en uso (para evitar duplicación de registro)
             */
            $scope.callGuardar(perfil);
		}
        
        
        
        
        // usuario nuevo
		$scope.callGuardar = function(perfil) {
			$log.debug("guardar usuario", perfil);
            function doOk(response) {
                mostrarMensajesDeBienvenida();                    
                $log.debug("Nuevo usuario creado", response.data);                    
                /*
                    Algo se deberia hacer con la informacion que esta trayendo el servidor
                */
                //usuario_dao.logIn(response.data); 
                $state.go('catalog.login');
            }
            //setUserAvatar();
            perfilService.singUp(filterVerifications(perfil)).then(doOk);
		}
        
        function filterVerifications(perfil){
            var res = {};
            for (var field in perfil){
                if (field != "passVerification" && field != "emailVerification") res[field] = perfil[field];
            }
            return res;
        }
        
        
		function mostrarMensajesDeBienvenida() {

			toastr.info(us.translate('INGRESA_MSG'), us.translate('AVISO_TOAST_TITLE'));
            toastr.info(us.translate('CORREO_MSG'), us.translate('AVISO_TOAST_TITLE'));
		}
	}

})();
