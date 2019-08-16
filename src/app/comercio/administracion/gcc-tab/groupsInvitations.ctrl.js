(function() {
  'use strict';

  angular.module('chasqui').controller('InvitationsGCCController', InvitationsGCCController);

  
  function InvitationsGCCController($scope, gccService, perfilService, us, toastr) {

    $scope.aceptarInvitacion = aceptarInvitacion;
    $scope.rechazarInvitacion = rechazarInvitacion;


    function aceptarInvitacion(notificacion) {
			function doOk(response) {
				toastr.success(us.translate('ACEPTADO'), us.translate('AVISO_TOAST_TITLE'));
        contextPurchaseService.refreshGrupos();
        callNotificaciones();
      }
      
			var params = {
        idInvitacion: notificacion.id
      }

			gccService.aceptarInvitacionAGrupo(params).then(doOk)

		}

		function rechazarInvitacion(notificacion) {
			function doOk(response) {
				toastr.info(us.translate('RECHAZADO'), us.translate('AVISO_TOAST_TITLE') );
			}
      
			var params = {
        idInvitacion: notificacion.id
      }

			gccService.rechazarInvitacionAGrupo(params).then(doOk)

		}
    
      
    function callNotificaciones() {

			function doOk(response) {
				$scope.invitations = response.data.filter(function(notificacion){
          return notificacion.estado == 'NOTIFICACION_NO_LEIDA' && isCompraColectiva(notificacion);
        });
			}
			perfilService.notificacionesNoLeidas().then(doOk);
    }
    
    function isCompraColectiva(notificacion){			
			return us.contieneCadena(notificacion.mensaje ,'ha invitado al grupo de compras colectivas');
    }

    /////////////////// INIT ////////////////////

    function init(){
      callNotificaciones();
    }

    init();

  }

})();
