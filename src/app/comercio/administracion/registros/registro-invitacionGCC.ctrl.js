(function() {
	'use strict';

	angular.module('chasqui').controller('RegistroInvitacionGCCController',
		RegistroInvitacionGCCController);

	/** Contempla los datos personales y 
	 *  el domicilio en dos pasos pero en la misma pantalla*/
	function RegistroInvitacionGCCController($log, $state, $stateParams, $scope, perfilService, contextCatalogObserver,
                                              ToastCommons, toastr, us, $timeout, contextPurchaseService) {
        
        $scope.selectedIndex = 0;
        
        var idInvitacion = 0;
        
        $scope.mailInvitacion = "";
        
        function init(){
            contextCatalogObserver.observe(function(){
                var idInvitacion = $stateParams.idInvitacion;
                perfilService.getMailInvitacion(idInvitacion).then(function(data){
                    $scope.mailInvitacion = "";
                })
            })
        }
        
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
				toastr.error(us.translate('PASS_INCORRECTO_MSG'), "Error");
            }
		}
        
        $scope.next = $scope.guardar;
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        // usuario nuevo
		function callGuardar(profile) {
            contextCatalogObserver.observe(function(){
                $log.debug("guardar usuario", profile);
                function doOk(response) {
                    mostrarMensajesDeBienvenida();                    
                    $log.debug("Nuevo usuario creado", response.data);                    
                    /*
                        Algo se deberia hacer con la informacion que esta trayendo el servidor
                    */
                    //usuario_dao.logIn(response.data); 
                    $state.go('catalog.login');
                }

                perfilService.singUpInvitacionGCC(prepareProfile(profile)).then(doOk);
            })
		}
        
        
        function prepareProfile(profile){
            return addFields(
                        filterFields(profile, ["passVerification", "emailVerification", "email"]), 
                        {invitacion: $stateParams.idInvitacion}
                    );
        }
        
          ////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\
         ///////      Algunas funciones [Juan, 14/11/17]    \\\\\\\
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
			toastr.info(us.translate('INGRESA_MSG'), us.translate('AVISO_TOAST_TITLE'));
			toastr.info(us.translate('CORREO_MSG'), us.translate('AVISO_TOAST_TITLE'));
		}
        
        init();
	}

})();
